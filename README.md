# TSS Frontend Demo

A demo web UI for a **Threshold Signature Scheme (TSS) treasury service**, built with Next.js, React, TypeScript, and Ant Design.

This app lets you interact with the TSS backend to create threshold-signed vaults, fund them with test ETH via a faucet, and send ETH transactions that are authorized with **2-of-3 threshold signatures** — the private key is split across 3 signing parties, and no single party ever holds the full secret.

This repository is intended as a **demo/showcase frontend** for the TSS service. It is not a production wallet and should not be used with real funds.

## Features

- **Create Vault** — spin up a new threshold-signed vault by name; the app initializes the vault, opens a signing channel, and runs distributed key generation (3 parties, threshold 1) with an animated progress modal
- **List Vaults** — server-rendered list of all vaults with name, address (copyable), and live ETH balance
- **Faucet** — request test ETH for a vault address with one click
- **Send ETH** — broadcast a transaction from a vault; the transaction is signed collaboratively via TSS before being confirmed, with balance validation and a MAX amount helper
- Toast notifications for all actions (`react-toastify`)
- Dark, glowing "treasury" themed UI with SCSS modules and custom hexagon iconography

## Tech Stack

### Core

- [Next.js](https://nextjs.org/) 16 (App Router, Server + Client Components)
- [React](https://react.dev/) 19
- [TypeScript](https://www.typescriptlang.org/)

### UI

- [Ant Design](https://ant.design/) v6 (forms, modals, buttons) with `@ant-design/nextjs-registry`
- [Sass](https://sass-lang.com/) / SCSS modules for component styling
- [Tailwind CSS](https://tailwindcss.com/) v4 (PostCSS plugin)
- [react-toastify](https://fkhadra.github.io/react-toastify/) for notifications
- `normalize.css`

### Networking

- [Axios](https://axios-http.com/) client wrapper (`src/utils/httpRequest.ts`) targeting the TSS backend `/v1` API

## Project Structure

```bash
tss-frontend-demo/
├── src/
│   ├── apis/
│   │   ├── tss.ts               # TSS endpoints: create channel, init vault, generate key, sign tx
│   │   ├── faucet.ts            # Faucet endpoint to fund an address with test ETH
│   │   └── users.ts             # Fetch vaults (users) list
│   ├── app/
│   │   ├── layout.tsx           # Root layout: header, Antd registry, toast container
│   │   ├── page.tsx             # Home page: CreateVault + ListVault
│   │   └── globals.scss         # Global styles
│   ├── components/
│   │   ├── Header/              # Top navigation/branding
│   │   ├── CreateVault/         # Vault creation form + key generation progress modal
│   │   ├── ListVault/           # Server component listing all vaults
│   │   └── VaultItem/           # Single vault row: copy address, faucet, send ETH modal
│   └── utils/
│       ├── env.ts               # Typed access to environment variables
│       └── httpRequest.ts       # Axios instance pointing at the TSS backend
├── public/
│   ├── icons/                   # Hexagon-themed SVG icons
│   └── images/                  # Logo and background
├── .env.example                 # Environment variables template
├── next.config.ts
├── package.json
└── README.md
```

## Prerequisites

- Node.js 20+
- npm or yarn
- A running **TSS backend service** (default: `http://localhost:8080`) exposing the `/v1` API described below

## Environment Variables

Create a `.env` file in the project root (you can copy from `.env.example`):

```bash
cp .env.example .env
```

Default variables:

```env
# public variables
NEXT_PUBLIC_TSS_BACKEND_URL="http://localhost:8080"
```

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_TSS_BACKEND_URL` | Base URL of the TSS backend service. All requests are sent to `<url>/v1/...` |

## Installation

```bash
yarn install
```

## Start Project

### 1) Start the TSS backend

Make sure the TSS backend service is running and reachable at the URL configured in `NEXT_PUBLIC_TSS_BACKEND_URL`.

### 2) Run the app

Development mode:

```bash
yarn dev
```

Production mode:

```bash
yarn build
yarn start
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## Backend Endpoints Used

All endpoints are prefixed with `/v1` on the TSS backend:

### TSS

- `POST /v1/tss/channel` — create a signing channel (with expiry)
- `POST /v1/tss/init-vault` — initialize a new vault
- `POST /v1/tss/generate-key` — run distributed key generation for a vault (3 parties, threshold 1)
- `POST /v1/tss/sign` — threshold-sign and broadcast an ETH transaction

### Faucet

- `POST /v1/faucet` — fund a vault address with test ETH

### Users

- `GET /v1/users` — list all vaults (name, address, balance)

## Available Scripts

- `yarn dev` — start the dev server with hot reload
- `yarn build` — build the production bundle
- `yarn start` — serve the production build
- `yarn lint` — run ESLint

## Demo-Only Disclaimer

This repository is a **demo frontend**, not a production wallet. Notable simplifications:

- The vault password is hardcoded on the client (`src/apis/tss.ts`)
- Party count (3) and threshold are fixed
- No authentication — anyone with access to the backend can create vaults and sign transactions
- Balance refresh relies on fixed delays after faucet/send actions

Use it only against a test backend with test funds.
