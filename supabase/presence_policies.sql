-- Supabase Realtime private Presence policies for the Souq al-Deir Firebase project.
-- Run in Supabase SQL Editor after enabling Firebase under Authentication > Third-party Auth.
-- Firebase ID tokens without a custom role claim are evaluated as role `anon`; these
-- policies explicitly allow anon/authenticated roles but validate Firebase iss + aud.
-- Do not disable RLS on realtime.messages.

DROP POLICY IF EXISTS "souq_presence_read_firebase_users" ON realtime.messages;
CREATE POLICY "souq_presence_read_firebase_users"
ON realtime.messages
FOR SELECT
TO anon, authenticated
USING (
  realtime.messages.extension = 'presence'
  AND (SELECT realtime.topic()) ~ '^souq-presence:[A-Za-z0-9_-]{1,128}$'
  AND (SELECT auth.jwt() ->> 'iss') = 'https://securetoken.google.com/souq-aldeir'
  AND (SELECT auth.jwt() ->> 'aud') = 'souq-aldeir'
);

DROP POLICY IF EXISTS "souq_presence_write_own_firebase_topic" ON realtime.messages;
CREATE POLICY "souq_presence_write_own_firebase_topic"
ON realtime.messages
FOR INSERT
TO anon, authenticated
WITH CHECK (
  realtime.messages.extension = 'presence'
  AND (SELECT realtime.topic()) = 'souq-presence:' || (SELECT auth.jwt() ->> 'sub')
  AND (SELECT auth.jwt() ->> 'iss') = 'https://securetoken.google.com/souq-aldeir'
  AND (SELECT auth.jwt() ->> 'aud') = 'souq-aldeir'
);
