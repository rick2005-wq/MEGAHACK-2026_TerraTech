# GrainOS Architecture

## System Overview
GrainOS is split into two independently deployable services:
- **Frontend**: Next.js on Vercel
- **Backend**: Node.js/Express on AWS EC2

## Request Flow
Client → Vercel (Next.js) → AWS EC2 (Express API) → PostgreSQL / Redis / S3

## Real-time Chat
Client ↔ Socket.io (on Express server) ↔ Redis pub/sub

## AI Translation
Message → Backend → Google Translate API → Translated stored in DB
