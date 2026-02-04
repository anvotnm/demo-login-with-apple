# Apple Sign-In React Implementation

A modern, beautiful React application demonstrating Apple Sign-In integration with both library-based and native SDK approaches.

## 🚀 Features

- ✅ **Two Implementation Methods**:
  - React library (`react-apple-signin-auth`)
  - Native Apple JS SDK
- ✅ **Modern UI/UX**: Beautiful dark theme with animations
- ✅ **Fully Responsive**: Works on all devices
- ✅ **Type-Safe**: Proper error handling and validation
- ✅ **Production Ready**: Includes authentication service and token management

## 📋 Prerequisites

- Node.js 16+ and npm
- Apple Developer Account
- Backend API running (see `APPLE_SIGNIN_GUIDE.md`)

## 🛠️ Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment

Copy `.env.example` to `.env` and update with your Apple credentials:

```bash
cp .env.example .env
```

Edit `.env`:

```env
VITE_APPLE_CLIENT_ID=your_apple_client_id
VITE_APPLE_REDIRECT_URI=https://your-frontend.com/apple-callback
VITE_API_BASE_URL=http://localhost:3000
```

### 3. Run Development Server

```bash
npm run dev
```

The app will open at `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/
│   ├── AppleSignInButton.jsx    # React library implementation
│   ├── AppleSignInNative.jsx    # Native SDK implementation
│   └── Dashboard.jsx             # User dashboard
├── pages/
│   └── LoginPage.jsx             # Login page with method selector
├── services/
│   └── authService.js            # Authentication service
├── config/
│   └── api.js                    # API configuration
├── App.jsx                       # Main app component
└── main.jsx                      # Entry point
```

## 🎨 Components

### AppleSignInButton (Recommended)

Uses `react-apple-signin-auth` library for easy integration:

```jsx
import AppleSignInButton from "./components/AppleSignInButton";

<AppleSignInButton
  onSuccess={(result) => console.log(result)}
  onError={(error) => console.error(error)}
/>;
```

### AppleSignInNative

Uses Apple's native JS SDK directly:

```jsx
import AppleSignInNative from "./components/AppleSignInNative";

<AppleSignInNative
  onSuccess={(result) => console.log(result)}
  onError={(error) => console.error(error)}
/>;
```

## 🔐 Authentication Flow

1. User clicks "Sign in with Apple"
2. Apple authentication popup appears
3. User authenticates with Apple ID
4. Frontend receives `id_token` and optional user data
5. Frontend sends to backend `/auth-customer/apple/token`
6. Backend validates token and returns user + access tokens
7. Frontend stores tokens and redirects to dashboard

## 🎯 API Integration

The app communicates with your backend API:

**Endpoint**: `POST /auth-customer/apple/token`

**Request**:

```json
{
  "id_token": "eyJraWQiOiJmaDZCczhDIi...",
  "code": "c1234567890abcdef",
  "user": {
    "name": {
      "firstName": "John",
      "lastName": "Doe"
    }
  }
}
```

**Response**:

```json
{
  "user": { ... },
  "access_token": "...",
  "refresh_token": "..."
}
```

## 🎨 Customization

### Styling

All styles use CSS custom properties defined in `src/index.css`. Modify these to match your brand:

```css
:root {
  --color-primary: hsl(220, 90%, 56%);
  --color-secondary: hsl(280, 70%, 60%);
  /* ... */
}
```

### Button Appearance

Customize Apple Sign-In button in component CSS files:

- `AppleSignInButton.css`
- `AppleSignInNative.css`

## 📱 Responsive Design

The app is fully responsive with breakpoints at:

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🔧 Build for Production

```bash
npm run build
```

Output will be in `dist/` directory.

## 📚 Documentation

- [Apple Sign-In Guide](./APPLE_SIGNIN_GUIDE.md) - Complete implementation guide
- [Apple Sign-In Summary](./APPLE_SIGNIN_SUMMARY.md) - Quick reference

## 🐛 Troubleshooting

### Apple SDK not loading

Make sure the Apple JS SDK is included in `index.html`:

```html
<script src="https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js"></script>
```

### CORS errors

Ensure your backend allows requests from your frontend domain.

### Token validation fails

Verify your Apple credentials in `.env` match your Apple Developer Console configuration.

## 📄 License

MIT

## 🤝 Contributing

Contributions welcome! Please open an issue or submit a PR.
