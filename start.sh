#!/bin/bash
# تشغيل سوق دير الزور المفتوح: Backend + Frontend معاً

# Start backend server in background
cd backend && npm start &
BACKEND_PID=$!

# Start frontend server (this will be the exposed port)
cd ../frontend && npm run dev

# Cleanup on exit
trap "kill $BACKEND_PID" EXIT
