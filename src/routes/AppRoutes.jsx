import React from "react";
import {  Route, Routes } from "react-router-dom";
import PublicRoute from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import {  routes } from "./RolebasedRoutes";
import { useSelector } from "react-redux";
import Landing from "../pages/Landing";

import SuperAdminLogin from "../pages/HeadOffice/Login"
import DbViewer from "../pages/Public/DbViewer";


function AppRoutes() {
  const user = useSelector(state=>state.auth.user); // Get the authentication status

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <PublicRoute restricted={false}>
            <SuperAdminLogin />
          </PublicRoute>
        }
      />
       <Route
        path="/login-ho"
        element={
          <PublicRoute restricted={false}>
            <SuperAdminLogin />
          </PublicRoute>
        }
      />

       {/* Private routes that require authentication */}
       {user &&
          routes[user.role].map((route, index) => (
            <Route
              key={index}
              path={route.path}
              element={<PrivateRoute  route={route} />}
            />
          ))}

     {/* <Route path="/menu" element= {<Menu/>}/>
     <Route path="/table" element= {<TableLayout/>}/>
     <Route path="/menu-detail/:skuId" element= {<MenuDetailView/>}/> */}

     {/* <Route path="/table-builder/:kotType" element= {<TableLayoutBuilder/>}/>
     
     <Route path="/back-display" element= {<CustomerDisplay/>}/>

     <Route path="/review/:salesId" element= {<CustomerBill/>}/> */}

     <Route path="/" element= {<Landing/>}/>

     <Route path="/dbview" element= {<DbViewer/>}/>
     {/* <Route path="/hook" element= {<WebhookTrigger/>}/>
     <Route path="/test-api" element= {<APITestUI/>}/>
     <Route path="/wb" element= {<WebSocketPage/>}/>
     <Route path="/dshbd" element= {<SalesComparisonChart/>}/> */}



      <Route path="*" element={<SuperAdminLogin/>} />

    </Routes>
  );
}

export default AppRoutes;
