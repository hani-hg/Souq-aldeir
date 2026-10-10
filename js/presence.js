/* Private Supabase Realtime Presence, authenticated by the current Firebase ID token.
   Each UID owns a separate topic. RLS allows a user to publish only to their own topic,
   while authenticated peers can subscribe to read transient online state. */
let souqPresenceClient = null;
let souqPresenceUserId = null;
let souqPresenceGeneration = 0;
let souqPresenceChannels = new Map();
let souqOnlineUserIds = new Set();

function validPresenceUid(userId) {
  return typeof userId === 'string' && /^[A-Za-z0-9_-]{1,128}$/.test(userId);
}

function renderPresenceIndicators() {
  document.querySelectorAll('[data-presence-user]').forEach(element => {
    const userId = element.dataset.presenceUser || '';
    const online = !!userId && souqOnlineUserIds.has(userId);
    element.hidden = !online;
    if (element.classList.contains('presence-label')) {
      element.setAttribute('aria-label', online ? 'متصل الآن' : 'غير متصل');
    } else {
      element.setAttribute('aria-label', online ? 'متصل الآن' : '');
      element.title = online ? 'متصل الآن' : '';
    }
  });
}

function updatePresenceUser(userId, channel, generation) {
  if (generation !== souqPresenceGeneration || souqPresenceChannels.get(userId) !== channel) return;
  const state = channel.presenceState();
  const online = Object.values(state || {}).some(metas => Array.isArray(metas) && metas.length > 0);
  if (online) souqOnlineUserIds.add(userId);
  else souqOnlineUserIds.delete(userId);
  renderPresenceIndicators();
}

function subscribeToUserPresence(userId, shouldTrack, generation) {
  if (!validPresenceUid(userId) || generation !== souqPresenceGeneration || !souqPresenceClient) return;
  if (souqPresenceChannels.has(userId)) return;

  const sessionKey = shouldTrack
    ? `${userId}:${globalThis.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2)}`}`
    : undefined;
  const presenceOptions = { enabled: true };
  if (sessionKey) presenceOptions.key = sessionKey;
  const channel = souqPresenceClient.channel(`souq-presence:${userId}`, {
    config: { private: true, presence: presenceOptions }
  });
  souqPresenceChannels.set(userId, channel);
  const sync = () => updatePresenceUser(userId, channel, generation);
  channel.on('presence', { event: 'sync' }, sync);
  channel.on('presence', { event: 'join' }, sync);
  channel.on('presence', { event: 'leave' }, sync);
  channel.subscribe(async status => {
    if (generation !== souqPresenceGeneration || souqPresenceChannels.get(userId) !== channel) return;
    if (status === 'SUBSCRIBED') {
      if (shouldTrack) {
        if (!auth.currentUser || auth.currentUser.uid !== userId) return;
        try {
          const result = await channel.track({ onlineAt: new Date().toISOString() });
          if (result !== 'ok') console.warn('Supabase Presence did not accept the tracking state');
        } catch (error) {
          console.warn('Supabase Presence tracking failed:', error?.message || error);
        }
      }
      sync();
    } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
      console.warn('Private Supabase Presence channel unavailable:', status);
    }
  });
}

function watchOnlinePresence(userIds) {
  if (!souqPresenceClient || !souqPresenceUserId) return;
  const desired = new Set((Array.isArray(userIds) ? userIds : [])
    .filter(uid => validPresenceUid(uid) && uid !== souqPresenceUserId));

  for (const [uid, channel] of souqPresenceChannels) {
    if (uid !== souqPresenceUserId && !desired.has(uid)) {
      souqPresenceChannels.delete(uid);
      souqOnlineUserIds.delete(uid);
      souqPresenceClient.removeChannel(channel).catch(() => {});
    }
  }
  desired.forEach(uid => subscribeToUserPresence(uid, false, souqPresenceGeneration));
  renderPresenceIndicators();
}

function stopObservedOnlinePresence() {
  if (!souqPresenceClient || !souqPresenceUserId) return;
  for (const [uid, channel] of souqPresenceChannels) {
    if (uid !== souqPresenceUserId) {
      souqPresenceChannels.delete(uid);
      souqOnlineUserIds.delete(uid);
      souqPresenceClient.removeChannel(channel).catch(() => {});
    }
  }
  renderPresenceIndicators();
}

async function stopOnlinePresence() {
  const generation = ++souqPresenceGeneration;
  const client = souqPresenceClient;
  const channels = [...souqPresenceChannels.values()];
  souqPresenceClient = null;
  souqPresenceUserId = null;
  souqPresenceChannels = new Map();
  souqOnlineUserIds = new Set();
  renderPresenceIndicators();
  if (client && channels.length) {
    await Promise.all(channels.map(channel => client.removeChannel(channel).catch(() => null)));
  }
  if (generation === souqPresenceGeneration) souqPresenceClient = null;
}

async function startOnlinePresence(userId) {
  if (!validPresenceUid(userId)) return;
  if (souqPresenceUserId === userId && souqPresenceClient) return;
  const generation = ++souqPresenceGeneration;
  const oldClient = souqPresenceClient;
  const oldChannels = [...souqPresenceChannels.values()];
  souqPresenceClient = null;
  souqPresenceUserId = null;
  souqPresenceChannels = new Map();
  souqOnlineUserIds = new Set();
  renderPresenceIndicators();

  try {
    if (oldClient && oldChannels.length) {
      await Promise.all(oldChannels.map(channel => oldClient.removeChannel(channel).catch(() => null)));
    }
    if (generation !== souqPresenceGeneration) return;
    const response = await fetch('/api/supabase-config', {
      method: 'GET', credentials: 'same-origin', cache: 'no-store',
      headers: { Accept: 'application/json' }
    });
    const config = await response.json().catch(() => ({}));
    if (!response.ok || typeof config.url !== 'string' || typeof config.anonKey !== 'string') {
      throw new Error('Supabase Realtime configuration is unavailable');
    }
    if (generation !== souqPresenceGeneration || !auth.currentUser || auth.currentUser.uid !== userId) return;
    if (!window.supabase || typeof window.supabase.createClient !== 'function') {
      throw new Error('Supabase Realtime client did not load');
    }
    const projectUrl = new URL(config.url);
    if (projectUrl.protocol !== 'https:' || !config.anonKey.trim()) {
      throw new Error('Invalid public Supabase configuration');
    }

    const client = window.supabase.createClient(projectUrl.href.replace(/\/$/, ''), config.anonKey, {
      auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
      accessToken: async () => {
        const firebaseUser = auth.currentUser;
        if (!firebaseUser || firebaseUser.uid !== userId) return null;
        return firebaseUser.getIdToken();
      },
      realtime: { params: { eventsPerSecond: 3 } }
    });
    if (generation !== souqPresenceGeneration) return;
    souqPresenceClient = client;
    souqPresenceUserId = userId;
    subscribeToUserPresence(userId, true, generation);

    const counterpartIds = Array.isArray(chatsCache)
      ? chatsCache.flatMap(chat => (chat.participants || []).filter(uid => uid !== userId))
      : [];
    watchOnlinePresence(counterpartIds);
  } catch (error) {
    if (generation === souqPresenceGeneration) {
      souqPresenceClient = null;
      souqPresenceUserId = null;
      souqPresenceChannels = new Map();
      souqOnlineUserIds = new Set();
      renderPresenceIndicators();
      console.warn('Online presence unavailable:', error?.message || error);
    }
  }
}
