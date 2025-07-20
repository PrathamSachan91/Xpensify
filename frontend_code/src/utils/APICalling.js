import toast from 'react-hot-toast';


export const logOutFunction = async () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
      window.location.href = "/"; // Redirect to login page
    } catch (e) {
      toast(e?.message);
      console.log(e);
    }
  };