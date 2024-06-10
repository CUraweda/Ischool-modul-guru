// import React, { ReactNode, useState, useEffect } from "react";
// import { Navigate } from "react-router-dom";
// // import api from "../Api/api";
// import { useStore } from "../store/Store";

// interface ProtectedRouteProps {
//   children: ReactNode;
// }

// const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
//   const [userCek, setUserCek] = useState<Boolean>(false);
//   const [shouldNavigate, setShouldNavigate] = useState<boolean>(false);
//   const { token, setToken } = useStore();

//   useEffect(() => {
//     const cekUser = async () => {
//       if (!token) {
//         setUserCek(false);
//         setShouldNavigate(true);
//         return;
//       }
    
//       try {
//         const response = await api.GetInfoUser(token);
//         const { role, aktif } = response.data.data.user;
    
//         const masaAktif = new Date(aktif);
//         const today = new Date();
    
//         const masaAktifDateOnly = masaAktif.toISOString().split('T')[0];
//         const todayDateOnly = today.toISOString().split('T')[0];
    
//         if (role && aktif) {
//           if (masaAktifDateOnly <= todayDateOnly) {
//             setToken(null);
//             setUserCek(true);
//           } else {
//             setUserCek(true);
//           }
//         } else {
//           setUserCek(false);
//         }
//       } catch (error) {
//         setUserCek(false);
//         setToken(null);
//         setShouldNavigate(true);
//       }
//     };
    

//     cekUser();
//   }, [token]);

//   useEffect(() => {
//     if (userCek && shouldNavigate) {
//       const timeout = setTimeout(() => {
//         setShouldNavigate(true);
//       }, 10);

//       return () => clearTimeout(timeout);
//     }
//   }, [userCek, shouldNavigate]);

//   if (shouldNavigate) {
//     setToken(null);
//     return <Navigate to="/register" replace />;
//   }

//   return <>{children}</>;
// };

// export default ProtectedRoute;
