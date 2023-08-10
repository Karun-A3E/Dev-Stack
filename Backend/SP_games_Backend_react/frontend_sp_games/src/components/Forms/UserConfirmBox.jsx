
import React from 'react';

const UserConfirmBox = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 rounded-md">
      <div className="bg-white p-6 rounded-lg shadow-lg m-5 backdrop-blur-md">
        <p className="text-lg font-semibold mb-4">{message}</p>
        <div className="flex justify-end">
          <button
            className="text-red-500 font-semibold mr-4 hover:bg-red-50 rounded-lg p-3"
            onClick={onCancel}
          >
            Cancel
          </button>
          <button
            className="text-green-500 font-semibold hover:bg-green-50 rounded-lg p-3"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserConfirmBox;
