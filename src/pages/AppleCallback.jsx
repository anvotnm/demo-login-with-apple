import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AppleCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Xử lý khi Apple redirect về đây
    // Trong trường hợp usePopup: true, trang này thường được mở trong popup
    // Chúng ta cần gửi message về cho window cha (opener)
    console.log('Apple Callback URL hit');

    // Kiểm tra nếu có hash hoặc query params chứa lỗi hoặc token
    const urlParams = new URLSearchParams(window.location.search);
    const error = urlParams.get('error');

    if (error) {
      console.error('Apple callback error:', error);
      if (window.opener) {
        window.opener.postMessage({ type: 'apple_sign_in_error', error }, '*');
        window.close();
      }
      return;
    }

    // Nếu đây là popup redirect, chúng ta báo cho opener biết đã xong
    // Lưu ý: data thực tế có thể nằm trong POST body mà Apple gửi, 
    // nhưng React Client không đọc được POST body trực tiếp.
    // Tuy nhiên, react-apple-signin-auth thường tự handle việc này nếu popup không bị redirect đi nơi khác.
    
    // Nếu bạn thấy trang này, có thể là flow popup bị thay thế bằng redirect
    // Hoặc Apple Redirect về đây sau khi user authorize.
    
    if (window.opener) {
        // Gửi signal về opener để nó biết flow đã hoàn tất (hoặc thử lấy lại credential)
        // Thực tế với thư viện react-apple-signin-auth, nó đợi window đóng hoặc nhận message.
        console.log('Posting message to opener');
        // Encode URL parameters and send back to opener
        const data = Object.fromEntries(urlParams.entries());
        window.opener.postMessage({ type: 'apple_sign_in_success', data }, '*');
        window.close();
    } else {
        // Nếu không có opener (ví dụ full page redirect flow), redirect về dashboard hoặc login
        navigate('/');
    }
  }, [navigate]);

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      background: '#000', 
      color: '#fff',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <div className="spinner-large" style={{
        width: '40px',
        height: '40px',
        border: '3px solid #333',
        borderTopColor: '#fff',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
      <p>Processing Apple Sign-In...</p>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AppleCallback;
