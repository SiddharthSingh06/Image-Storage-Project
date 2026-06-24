# 🛡️ Vaultrix

Vaultrix is a full-stack, responsive, and minimalist image storage and sharing web application designed with a bold **Neo-Brutalist** aesthetic. Securely upload, organize, search, and publicly share your images from a single centralized vault. 

It is built with **Next.js 16 (App Router)**, **React 19**, **TypeScript**, and **Tailwind CSS v4** on the frontend, powered by **Firebase Auth & Firestore** on the backend, and uses the **ImgBB API** for image hosting.

---

## ✨ Features

- 🔐 **Secure Authentication**:
  - Sign Up & Log In with email/password.
  - One-click OAuth login via **Google Sign-In**.
  - Route guarding prevents unauthenticated access to dashboards, galleries, and image details.
- 📊 **Dynamic Dashboard Summary**:
  - Live trackers for total uploaded images, total storage consumed (auto-formatted in human-readable bytes), and current count of active shared links.
- 📤 **Drag & Drop Upload Zone**:
  - Upload PNG, JPG, JPEG, and GIF files up to 32MB.
  - Automatically converts files to Base64 in-browser and uploads them to ImgBB.
- 🗂️ **Interactive Gallery Grid**:
  - **Live Search**: Instant client-side search by filename.
  - **Filters**: Quickly toggle between all files and shared files.
  - **Sorting**: Order by *Newest First*, *Oldest First*, or *Largest First*.
  - Optimistic UI updates on image deletion and status changes.
- 🔗 **Advanced Image Sharing**:
  - Generate a secure UUID-based share link for any image.
  - Instantly copy public URLs or direct image URLs to your clipboard.
  - Public share page allows anonymous users to download images via a custom server-side proxy route, ensuring direct downloads instead of browser redirections.
- 🗑️ **Double-Verify Deletions**:
  - Integrated confirmation modals prevent accidental deletions.
  - Deletes documents from Firestore database collections and triggers a deletion query to ImgBB to preserve storage.
- 🎨 **Neo-Brutalist Design System**:
  - Built with Tailwind CSS v4 featuring raw layouts, stark contrast, heavy outlines (`vaultrix-border`), thick offsets (`vaultrix-shadow`), and responsive animations.

---

## 🛠️ Tech Stack & Integrations

- **Frontend Framework**: [Next.js 16.2.2](https://nextjs.org/) (using the React Server/Client Components architecture)
- **UI Library**: [React 19.2.4](https://react.dev/) & [Lucide React](https://lucide.dev/) (icons)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with PostCSS
- **Database & Auth**: [Firebase v12.11.0](https://firebase.google.com/) (Firestore database and Firebase Authentication)
- **Storage / Image Hosting**: [ImgBB API](https://api.imgbb.com/) for reliable image CDN uploads
- **Package Manager**: NPM / Node.js

---

## 📁 Project Structure

```text
vaultrix/
├── app/                      # Next.js App Router folders
│   ├── api/
│   │   └── download/         # Proxy API to download hosted images with custom headers
│   │       └── route.ts
│   ├── gallery/              # User gallery route with search, sorting, and filters
│   │   └── page.tsx
│   ├── image/                # Individual image detail and action page
│   │   └── [id]/
│   │       └── page.tsx
│   ├── login/                # Authentication - Login page
│   │   └── page.tsx
│   ├── share/                # Dynamic public path for shared images
│   │   └── [id]/
│   │       └── page.tsx
│   ├── signup/               # Authentication - Sign Up page
│   │   └── page.tsx
│   ├── globals.css           # Neo-Brutalist utility classes and color theme tokens
│   ├── layout.tsx            # Global layout providing Auth and Toast providers
│   └── page.tsx              # Dashboard route (main authenticated entrypoint)
├── components/               # Shared frontend UI & feature components
│   ├── ui/                   # Modular UI elements
│   │   ├── Button.tsx        # Styled theme button
│   │   ├── ConfirmDialog.tsx # Accessible modal for deletion confirmations
│   │   ├── Input.tsx         # Basic input with custom borders
│   │   ├── Modal.tsx         # Overlay overlay framework
│   │   └── Toast.tsx         # Notification alerts (success, error, info)
│   ├── ImageCard.tsx         # Thumbnail card showing controls and action triggers
│   ├── ImageGrid.tsx         # Grid wrapper for image lists
│   ├── Navbar.tsx            # Sticky header with links and session indicators
│   └── UploadZone.tsx        # Drag & drop file target
├── hooks/
│   └── useImages.ts          # State custom hook wrapping Firestore & ImgBB async actions
├── lib/
│   ├── auth.tsx              # Context provider wrapping Firebase authentication state
│   ├── firebase.ts           # Initialization client for Firebase
│   ├── firestore.ts          # Core CRUD database services
│   ├── formatters.ts         # Numeric formatting utilities (bytes sizing)
│   ├── imgbb.ts              # API layer for uploading/deleting external images
│   └── utils.ts              # Styling merge utility (clsx / tailwind-merge)
├── types/
│   └── index.ts              # TypeScript models for images and shares
├── package.json              # Direct project dependencies and scripts
└── tsconfig.json             # TypeScript compiler rules
```

---

## ⚙️ Environment Configuration

To run Vaultrix locally, create an `.env.local` file in the root directory and populate it with your Firebase and ImgBB keys:

```ini
# Firebase Config (Client-side variables prefixed with NEXT_PUBLIC_)
NEXT_PUBLIC_FIREBASE_API_KEY="your-firebase-api-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-project-id.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-project-id.firebasestorage.app"
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-messaging-sender-id"
NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"

# ImgBB API Config (Used for image hosting)
NEXT_PUBLIC_IMGBB_API_KEY="your-imgbb-api-key"
```

---

## 🛢️ Firestore Data Schema

Vaultrix structure organizes documents into two major path schemas in Firestore:

### 1. User-Specific Collections
Store image metadata details isolated under individual user directories:
* **Path**: `/users/{uid}/images/{imageId}`
* **Data Model**:
  ```typescript
  interface VaultrixImage {
    id: string;             // Document ID
    imgbbUrl: string;       // Hosted image direct url
    imgbbDeleteUrl: string; // URL used to remove image from ImgBB
    displayUrl: string;     // Fallback display url
    filename: string;       // Original upload filename
    size: number;           // Size in bytes
    uploadedAt: number;     // Unix epoch timestamp
    isShared: boolean;      // Share toggle state
    shareId: string;        // Generated UUID for sharing (if active)
  }
  ```

### 2. Public Shared Mappings
Allows anonymous, instant lookups for shared links without exposing complete user profiles:
* **Path**: `/sharedImages/{shareId}`
* **Data Model**:
  ```typescript
  interface SharedImage {
    uid: string;            // Owner user ID
    imageId: string;        // Target image ID in user collection
  }
  ```

---

## 🚀 Installation & Running Locally

Follow these steps to set up and run the project locally:

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser to view the application.

### 3. Build for Production
Generate optimized production bundles:
```bash
npm run build
```

### 4. Start Production Server
Launch the application in production mode:
```bash
npm run start
```

### 5. Linting
Run ESLint to check for code issues:
```bash
npm run lint
```

---

## 🔒 Security Best Practices for Production

1. **Firestore Rules**:
   Ensure users can only access their own subcollections under `/users/{uid}`.
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       // Users can only read/write their own subcollections
       match /users/{userId}/{document=**} {
         allow read, write: if request.auth != null && request.auth.uid == userId;
       }
       
       // Public share lookups are globally readable, but writeable only by authenticated owners
       match /sharedImages/{shareId} {
         allow read: if true;
         allow write: if request.auth != null;
       }
     }
   }
   ```
2. **Authentication Rules**:
   Enable both **Email/Password Provider** and **Google Identity Provider** inside the Firebase Auth console.

---

Developed with ❤️ using Next.js & Firebase.
