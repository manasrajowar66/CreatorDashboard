import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

const GlobalLoader: React.FC = () => {
  const { loading } = useSelector((state: RootState) => state.globalLoader);

  return (
    <>
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black opacity-50">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
    </>
  );
};

export default GlobalLoader;
