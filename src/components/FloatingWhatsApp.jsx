export default function FloatingWhatsApp() {
  const whatsappNumber = '27613991212';
  const whatsappMessage =
    "Hi SaxsProjects! I'd like to inquire about your services.";

  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  return (
    <>
      <a
        href={whatsappLink}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        title="Chat with us on WhatsApp"
        className="floating-whatsapp"
      >
        <svg
          viewBox="0 0 32 32"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            fill="white"
            d="M19.11 17.21c-.26-.13-1.53-.75-1.77-.84-.24-.09-.41-.13-.58.13-.17.26-.67.84-.82 1.01-.15.17-.3.19-.56.06-.26-.13-1.08-.4-2.06-1.28-.76-.68-1.27-1.52-1.42-1.78-.15-.26-.02-.4.11-.53.11-.11.26-.28.39-.42.13-.15.17-.25.26-.42.09-.17.04-.32-.02-.45-.06-.13-.58-1.39-.8-1.91-.21-.5-.42-.43-.58-.44h-.49c-.17 0-.44.06-.67.32-.23.26-.88.86-.88 2.09s.91 2.43 1.04 2.6c.13.17 1.78 2.72 4.32 3.81.61.26 1.08.42 1.45.54.61.19 1.16.16 1.59.1.49-.07 1.53-.62 1.75-1.22.22-.6.22-1.11.15-1.22-.06-.11-.24-.17-.5-.3Z"
          />
          <path
            fill="white"
            d="M16.02 3C8.84 3 3 8.74 3 15.82c0 2.27.6 4.49 1.74 6.44L3 29l6.97-1.81a13.1 13.1 0 0 0 6.05 1.54H16c7.18 0 13.02-5.74 13.02-12.82C29.02 8.74 23.18 3 16.02 3Zm0 23.5c-1.88 0-3.72-.5-5.32-1.46l-.38-.22-4.14 1.08 1.1-4.02-.25-.41a10.3 10.3 0 0 1-1.58-5.48c0-5.72 4.73-10.37 10.56-10.37 5.82 0 10.56 4.65 10.56 10.37 0 5.72-4.74 10.51-10.55 10.51Z"
          />
        </svg>
      </a>

      <style jsx>{`
        .floating-whatsapp {
          position: fixed;
          bottom: 24px;
          right: 24px;

          width: 64px;
          height: 64px;

          background: #25d366;
          border-radius: 50%;

          display: flex;
          align-items: center;
          justify-content: center;

          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.25);

          z-index: 9999;
          cursor: pointer;
          text-decoration: none;

          transition: transform 0.2s ease,
            box-shadow 0.2s ease;
        }

        .floating-whatsapp:hover {
          transform: scale(1.08);
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.3);
        }

        .floating-whatsapp svg {
          width: 38px;
          height: 38px;
          display: block;
        }

        @media (max-width: 768px) {
          .floating-whatsapp {
            width: 58px;
            height: 58px;
            bottom: 20px;
            right: 20px;
          }

          .floating-whatsapp svg {
            width: 34px;
            height: 34px;
          }
        }
      `}</style>
    </>
  );
}