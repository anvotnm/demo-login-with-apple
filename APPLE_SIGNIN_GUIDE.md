# Apple Sign-In Implementation Guide

## Backend Changes

Backend đã được cập nhật để hỗ trợ **client-side Apple Sign-In flow** (recommended).

### New Endpoint

**POST** `/auth-customer/apple/token`

**Request Body:**

```json
{
  "id_token": "eyJraWQiOiJmaDZCczhDIiwiYWxnIjoiUlMyNTYifQ...",
  "code": "c1234567890abcdef", // optional
  "user": {
    // optional, only on first sign-in
    "name": {
      "firstName": "John",
      "lastName": "Doe"
    }
  }
}
```

**Response:**

```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "full_name": "John Doe",
    ...
  },
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## Frontend Implementation

### Option 1: Using React (with react-apple-signin-auth)

#### 1. Install package

```bash
npm install react-apple-signin-auth
```

#### 2. Implement component

```jsx
import AppleSignin from "react-apple-signin-auth";

const AppleLoginButton = () => {
  const handleAppleLogin = async (response) => {
    try {
      console.log("Apple response:", response);

      // Send to backend
      const result = await fetch(
        "http://localhost:3000/auth-customer/apple/token",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_token: response.authorization.id_token,
            code: response.authorization.code,
            user: response.user, // Only available on first sign-in
          }),
        },
      );

      const data = await result.json();

      // Save tokens
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);

      // Redirect to dashboard
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Apple login failed:", error);
    }
  };

  return (
    <AppleSignin
      authOptions={{
        clientId: "your_apple_client_id",
        scope: "email name",
        redirectURI: "https://your-frontend.com/apple-callback",
        state: "state",
        nonce: "nonce",
        usePopup: true, // Use popup instead of redirect
      }}
      onSuccess={handleAppleLogin}
      onError={(error) => console.error(error)}
      uiType="dark"
      className="apple-auth-btn"
      buttonExtraChildren="Continue with Apple"
    />
  );
};

export default AppleLoginButton;
```

---

### Option 2: Using Vanilla JavaScript

#### 1. Add Apple JS SDK

```html
<script
  type="text/javascript"
  src="https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js"
></script>
```

#### 2. Initialize Apple Sign-In

```html
<div
  id="appleid-signin"
  class="signin-button"
  data-color="black"
  data-border="true"
  data-type="sign in"
></div>

<script>
  AppleID.auth.init({
    clientId: "your_apple_client_id",
    scope: "name email",
    redirectURI: "https://your-frontend.com/apple-callback",
    state: "state",
    nonce: "nonce",
    usePopup: true,
  });

  // Listen for authorization success
  document.addEventListener("AppleIDSignInOnSuccess", async (event) => {
    const { authorization, user } = event.detail;

    try {
      const response = await fetch(
        "http://localhost:3000/auth-customer/apple/token",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_token: authorization.id_token,
            code: authorization.code,
            user: user,
          }),
        },
      );

      const data = await response.json();

      // Save tokens
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);

      // Redirect
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Login failed:", error);
    }
  });

  // Listen for authorization failures
  document.addEventListener("AppleIDSignInOnFailure", (event) => {
    console.error("Apple Sign-In failed:", event.detail.error);
  });
</script>
```

---

### Option 3: Using Vue 3

```vue
<template>
  <div>
    <div id="appleid-signin" class="signin-button"></div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

onMounted(() => {
  // Load Apple JS SDK
  const script = document.createElement("script");
  script.src =
    "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js";
  script.async = true;
  document.head.appendChild(script);

  script.onload = () => {
    window.AppleID.auth.init({
      clientId: "your_apple_client_id",
      scope: "name email",
      redirectURI: "https://your-frontend.com/apple-callback",
      state: "state",
      usePopup: true,
    });

    // Success handler
    document.addEventListener("AppleIDSignInOnSuccess", async (event) => {
      const { authorization, user } = event.detail;

      try {
        const response = await fetch(
          "http://localhost:3000/auth-customer/apple/token",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              id_token: authorization.id_token,
              code: authorization.code,
              user: user,
            }),
          },
        );

        const data = await response.json();

        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("refresh_token", data.refresh_token);

        router.push("/dashboard");
      } catch (error) {
        console.error("Login failed:", error);
      }
    });

    // Error handler
    document.addEventListener("AppleIDSignInOnFailure", (event) => {
      console.error("Apple Sign-In failed:", event.detail.error);
    });
  };
});
</script>
```

---

## Environment Variables

### For Client-side Flow (Recommended)

Update your `.env` file:

```bash
# Apple Auth - Client-side flow
APPLE_CLIENT_ID=your_apple_client_id
APPLE_TEAM_ID=your_apple_team_id
APPLE_KEY_ID=your_apple_key_id
APPLE_PRIVATE_KEY_STRING="your_private_key_content_with_newlines_escaped"
APPLE_CALLBACK_URL=https://your-frontend.com/apple-callback  # Frontend URL
```

**Note:** Với client-side flow, `APPLE_CALLBACK_URL` chỉ để Apple redirect về frontend. Backend không cần xử lý callback URL này nữa.

---

## Important Notes

1. **User info chỉ có lần đầu**: Apple chỉ trả về `user.name` trong lần đăng nhập đầu tiên. Các lần sau chỉ có `id_token` với email.

2. **Email verification**: Apple ID token có field `email_verified` để check email đã được verify chưa.

3. **AppleID format**: `sub` field trong token là unique Apple user ID, không đổi.

4. **Testing**: Để test, bạn cần:
   - Apple Developer Account
   - Configure Service ID
   - Add domain và redirect URLs trong Apple Developer Console

5. **Security**: ID token được verify bằng JWT decode. Trong production, nên verify signature với Apple's public key.

---

## Testing

Test endpoint với curl:

```bash
curl -X POST http://localhost:3000/auth-customer/apple/token \
  -H "Content-Type: application/json" \
  -d '{
    "id_token": "YOUR_APPLE_ID_TOKEN",
    "user": {
      "name": {
        "firstName": "John",
        "lastName": "Doe"
      }
    }
  }'
```

---

## Migration from Server-side Flow

Nếu bạn đang dùng server-side flow (GET `/apple` → POST `/apple/callback`), bạn có thể:

1. **Giữ nguyên** endpoints cũ để backward compatibility
2. **Thêm mới** endpoint `/apple/token` cho client-side flow
3. **Migrate dần** frontend sang client-side flow

Cả 2 flows đều hoạt động song song.
