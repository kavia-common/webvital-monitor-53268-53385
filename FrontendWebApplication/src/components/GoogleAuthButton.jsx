import React, { useEffect, useRef, useState } from "react";
import { googleLogin, me } from "../api/auth";
import { useAuth } from "../context/AuthContext";

/**
 * PUBLIC_INTERFACE
 * GoogleAuthButton
 * Renders a "Continue with Google" button using Google's Identity Services.
 * - Loads the GIS script if not present.
 * - Initializes the Google sign-in client using REACT_APP_GOOGLE_OAUTH_CLIENT_ID.
 * - On success, posts the id_token to backend via /api/v1/auth/google and logs user in.
 * Props:
 *   variant: "login" | "register" - affects post-auth redirect.
 *   className: additional classNames for container fallback button if GIS is unavailable.
 */
export default function GoogleAuthButton({ variant = "login", className = "" }) {
  const btnRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const { setUser } = useAuth();
  const clientId = process.env.REACT_APP_GOOGLE_OAUTH_CLIENT_ID;

  useEffect(() => {
    // If no clientId configured, don't attempt to initialize
    if (!clientId) return;

    function setup() {
      if (!window.google || !window.google.accounts || !window.google.accounts.id) return;
      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response) => {
            const idToken = response?.credential;
            if (!idToken) return;
            setErr("");
            setLoading(true);
            try {
              await googleLogin(idToken);
              const u = await me();
              setUser(u);
              // Redirect based on variant
              if (variant === "register") {
                window.location.href = "/onboarding";
              } else {
                window.location.href = "/";
              }
            } catch (e2) {
              setErr(e2?.response?.data?.message || "Google authentication failed");
              setLoading(false);
            }
          },
          // prompt_parent_id could be configured if using One Tap prompt containers
        });

        if (btnRef.current) {
          // Render Google button
          window.google.accounts.id.renderButton(btnRef.current, {
            theme: "outline",
            size: "large",
            type: "standard",
            shape: "rectangular",
            text: "continue_with",
            logo_alignment: "left",
            width: 320,
          });
        }
        setReady(true);
      } catch (e) {
        // Fail silently, will show fallback button
        setReady(false);
      }
    }

    // Load script if not already loaded
    if (!window.google || !window.google.accounts || !window.google.accounts.id) {
      const scriptId = "google-identity-services";
      if (!document.getElementById(scriptId)) {
        const s = document.createElement("script");
        s.src = "https://accounts.google.com/gsi/client";
        s.async = true;
        s.defer = true;
        s.id = scriptId;
        s.onload = setup;
        s.onerror = () => setReady(false);
        document.body.appendChild(s);
      } else {
        // Script present, attempt setup once it's loaded
        if (window.google && window.google.accounts && window.google.accounts.id) {
          setup();
        } else {
          document.getElementById(scriptId).addEventListener("load", setup);
        }
      }
    } else {
      setup();
    }
  }, [clientId, variant, setUser]);

  async function handleFallbackClick() {
    // Fallback if GIS cannot render; try to prompt One Tap manually if available or show info
    if (window.google?.accounts?.id) {
      try {
        window.google.accounts.id.prompt(); // show One Tap prompt
      } catch {
        // ignore
      }
    } else {
      // As last resort, inform missing configuration
      setErr(
        "Google Sign-In not available. Please ensure REACT_APP_GOOGLE_OAUTH_CLIENT_ID is set and reload the page."
      );
    }
  }

  return (
    <div className="mt-3">
      {err && <div className="mb-2 text-sm text-red-600">{err}</div>}
      {clientId ? (
        <>
          <div ref={btnRef} />
          {!ready && (
            <button
              type="button"
              className={`btn w-full mt-2 bg-white text-gray-800 border border-gray-300 hover:bg-gray-50 ${className}`}
              onClick={handleFallbackClick}
              disabled={loading}
            >
              Continue with Google
            </button>
          )}
        </>
      ) : (
        <div className="text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 rounded p-2">
          Google OAuth is not configured. Set REACT_APP_GOOGLE_OAUTH_CLIENT_ID in .env to enable.
        </div>
      )}
    </div>
  );
}
