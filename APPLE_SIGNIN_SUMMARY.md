# Apple Sign-In - Quick Summary

## ✅ Đã Implement

### 1. **New DTO**

- `src/auth/dto/apple-token-login.dto.ts`
- Nhận `id_token`, `code` (optional), `user` (optional)

### 2. **New Service Method**

- `AuthService.verifyAppleIdToken()`
- Decode và verify Apple ID token
- Extract: appleId, email, firstName, lastName

### 3. **New Controller Endpoint**

- **POST** `/auth-customer/apple/token`
- Nhận token từ frontend
- Trả về user info + access_token + refresh_token

### 4. **Updated .env.example**

- Thêm comment giải thích 2 options:
  - Option 1: Server-side flow (redirect)
  - Option 2: Client-side flow (recommended)

---

## 🎯 Cách Frontend Implement

### Quick Example (React)

```jsx
import AppleSignin from "react-apple-signin-auth";

const handleAppleLogin = async (response) => {
  const result = await fetch(
    "http://localhost:3000/auth-customer/apple/token",
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_token: response.authorization.id_token,
        user: response.user,
      }),
    },
  );

  const data = await result.json();
  localStorage.setItem("access_token", data.access_token);
  window.location.href = "/dashboard";
};

<AppleSignin
  authOptions={{
    clientId: "your_apple_client_id",
    scope: "email name",
    redirectURI: "https://your-frontend.com/apple-callback",
    usePopup: true,
  }}
  onSuccess={handleAppleLogin}
/>;
```

---

## 📝 Có Cần Chỉnh APPLE_CALLBACK_URL?

### ❌ **KHÔNG** - Nếu dùng server-side flow

```bash
APPLE_CALLBACK_URL=http://localhost:3000/auth-customer/apple/callback
```

### ✅ **CÓ** - Nếu dùng client-side flow (recommended)

```bash
APPLE_CALLBACK_URL=https://your-frontend.com/apple-callback
```

**Lý do:** Với client-side flow, Apple redirect về frontend, frontend nhận token rồi gửi về backend qua endpoint `/apple/token`.

---

## 📚 Full Documentation

Xem chi tiết tại: **APPLE_SIGNIN_GUIDE.md**

---

## 🔄 Flow Comparison

### Server-side (Old)

```
User → Frontend → Backend /apple → Apple Login → Apple → Backend /apple/callback → Response
```

### Client-side (New - Recommended)

```
User → Frontend → Apple Login → Apple → Frontend → Backend /apple/token → Response
```

**Ưu điểm client-side:**

- ✅ UX tốt hơn (popup)
- ✅ Frontend control flow
- ✅ Dễ handle error
- ✅ Không mất state
