import '../assets/Popup.css'; // You can style your popup in a separate CSS file

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
}

const Popup: React.FC<PopupProps> = ({ isOpen, onClose }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        {/* Your popup content goes here */}
        <p>Terms of Service | Privacy Policy</p>
        <div className="inside-content">
            <hr></hr>
            <p>
                <b>Terms of Service:</b><br></br>
                Welcome to Text Adventure Game!<br></br>
                These terms and conditions outline the rules and regulations for the use of Text Adventure Game, owned and operated by Tuukkaleksi.<br></br>
                By accessing this Website, we assume you accept these terms and conditions in full. Do not continue to use [WEBSITEURL] if you do not accept all of the terms and conditions stated on this page.<br></br>
                <b>1. Intellectual Property</b><br></br>
                The content, design, and all elements of this Website are protected by intellectual property and other applicable laws. You may not reproduce, distribute, modify, create derivative works of, publicly display, publicly perform, republish, download, store, or transmit any of the material on our Website without our prior written consent.<br></br>
                <b>2. User Content</b><br></br>
                By submitting or posting content on the Website, you grant Text Adventure Game a non-exclusive, royalty-free, perpetual, irrevocable, and fully sublicensable right to use, reproduce, modify, adapt, publish, translate, create derivative works from, distribute, and display such content throughout the world in any media.<br></br>
                <b>3. Limitation of Liability</b><br></br>
                We shall not be held liable for any special or consequential damages that result from the use of, or the inability to use, the materials on this site or the performance of the products, even if we have been advised of the possibility of such damages.<br></br><br></br>
                <b>Privacy Policy:</b><br></br>
                As Text Adventure Game, i respect your privacy and are committed to protecting it through our compliance with this policy.<br></br>
                <b>1. Information We Collect</b><br></br>
                We may collect personal information that you provide directly to us, such as OpenAI Api Key, Email Address and Password, and any other information you choose to provide.<br></br>
                <b>2. How We Use Your Information</b><br></br>
                We may use the information we collect from you to provide, maintain, and improve our services, and to communicate with you.<br></br>
                <b>3. Sharing of Your Information</b><br></br>
                We may share your information with third-party service providers who assist us in operating our Website or providing our services.<br></br>
                <b>4. Your Choices</b><br></br>
                You may have the right to access, correct, or delete your personal information by contacting me at tuksu090@hotmail.com.<br></br>
            </p>
            <hr></hr>
        </div>
        <button className="close-button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default Popup;