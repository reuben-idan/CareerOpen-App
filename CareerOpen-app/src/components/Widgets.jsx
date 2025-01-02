// components/Widgets.jsx
import "react";

const Widgets = () => {
  return (
    <aside className="w-64 bg-white shadow-md rounded-lg p-4 hidden lg:block">
      <div className="mb-4">
        <h4 className="font-medium text-gray-800 mb-2">Add to your feed</h4>
        <button className="text-blue-600 hover:underline">Amalitech</button>
        <button className="text-blue-600 hover:underline">
          KNUST E-Learning
        </button>
      </div>
      <div>
        <h4 className="font-medium text-gray-800 mb-2">Promoted</h4>
        <p className="text-gray-600">Try our Premium features for free!</p>
      </div>
    </aside>
  );
};

export default Widgets;
