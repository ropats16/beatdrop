import { Link } from "react-router-dom";
// props to help modal
const Modal = ({ isOpen, onClose, text }) => {
  if (!isOpen) return null;
  // Modal is displayed only when isOpen is true
  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <div className="inline-block align-middle bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all my-8 align-middle max-w-lg w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 flex flex-col items-center justify-center">
            {/* Cool gif */}
            <img
              src="https://g8way.io/IkMJRqi_0Xx_QhstK4WE3rsQqQxC07n84UagPgqGXfc"
              alt="Modal"
              className="w-48 object-cover mb-4"
            />
            {/* Text displaying status of upload call */}
            <div className="text-center mb-4">{text}</div>
            {/*  */}
            {text === "Deployed successfully..." ? (
              <button className="btn btn-ghost text-center">
                <Link to="/view">View Posts</Link>
              </button>
            ) : null}
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:justify-center">
            {/* button to close modal */}
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-300 text-base font-medium text-white hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
