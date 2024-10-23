import React from 'react';
import axios from "axios"
import { useRef, useState } from "react"
import { Card, CardBody, Col, Row, Spinner } from "react-bootstrap"
import { useNavigate } from "react-router-dom"
import logo from "../images/logo_station.png";
import bgImage from '../images/bgStation.jpg';
import { useAuth } from '../AuthContext';

const Auth = () => {
  const { login, user, setUser, loading } = useAuth();
  const email = useRef("")
  const password = useRef("")
  const mfaCode = useRef("")
  const [isMfaRequired, setIsMfaRequired] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (isMfaRequired) {
      try {
        const response = await axios.post('http://localhost:9000/verify-mfa', {
          email: email.current.value,
          mfaCode: mfaCode.current.value
        }, { withCredentials: true });

        // Met à jour le contexte global
        setUser(response.data.user);
        navigate('/menu');
      } catch (error) {
        console.error("Erreur MFA:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        await login(email.current.value, password.current.value);
        setIsMfaRequired(true);
      } catch (error) {
        console.error("Erreur de connexion:", error);
      } finally {
        setIsLoading(false); // Hide loading spinner after login attempt
      }
    }
  };

  return (
    <div className="container-fluid vh-100">
      <Row className="h-100">
        <Col xs={12} md={6}
          style={{
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
          className="d-flex justify-content-center align-items-center bg-light">
          <h1 className="text-center text-light"> </h1>
        </Col>
        <Col xs={12} md={6} className=" justify-content-center align-items-center">
          <div className='d-flex justify-content-center align-items-center'>
            <img src={logo} alt="" width="50%" />
          </div>
          <div className="d-flex justify-content-center align-items-center">
            <Card className='bg-dark text-white ' style={{ borderRadius: '1rem', width: '50%', height: '50%' }}>

              <CardBody className='py-5 d-flex flex-column align-items-center mx-auto' style={{ width: '100%' }} >
                <svg width="100px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM15 9C15 10.6569 13.6569 12 12 12C10.3431 12 9 10.6569 9 9C9 7.34315 10.3431 6 12 6C13.6569 6 15 7.34315 15 9ZM12 20.5C13.784 20.5 15.4397 19.9504 16.8069 19.0112C17.4108 18.5964 17.6688 17.8062 17.3178 17.1632C16.59 15.8303 15.0902 15 11.9999 15C8.90969 15 7.40997 15.8302 6.68214 17.1632C6.33105 17.8062 6.5891 18.5963 7.19296 19.0111C8.56018 19.9503 10.2159 20.5 12 20.5Z" fill="#ffffff" />
                </svg>

                <form onSubmit={handleSubmit}>
                  <div className="d-flex input-group mb-5">
                    <svg style={{ marginRight: '20px' }} width="20px" viewBox="0 -3.5 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" xmlnssketch="http://www.bohemiancoding.com/sketch/ns">
                      <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" sketchtype="MSPage">
                        <g id="Icon-Set-Filled" sketchtype="MSLayerGroup" transform="translate(-414.000000, -261.000000)" fill="#ffffff">
                          <path d="M430,275.916 L426.684,273.167 L415.115,285.01 L444.591,285.01 L433.235,273.147 L430,275.916 L430,275.916 Z M434.89,271.89 L445.892,283.329 C445.955,283.107 446,282.877 446,282.634 L446,262.862 L434.89,271.89 L434.89,271.89 Z M414,262.816 L414,282.634 C414,282.877 414.045,283.107 414.108,283.329 L425.147,271.927 L414,262.816 L414,262.816 Z M445,261 L415,261 L430,273.019 L445,261 L445,261 Z" id="mail" sketchtype="MSShapeGroup">

                          </path>
                        </g>
                      </g>
                    </svg>
                    <input type="email" name="email" placeholder='Email' ref={email} style={{ width: '100%' }} className="input champ" />
                  </div>
                  <div className="d-flex input-group mb-5">
                    <svg style={{ marginRight: '20px' }} fill="#ffffff" width="20px" viewBox="-13.39 0 122.88 122.88" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" enableBackground="new 0 0 96.108 122.88" xmlSpace="preserve">
                      <g>
                        <path fillRule="evenodd" clipRule="evenodd" d="M2.892,56.036h8.959v-1.075V37.117c0-10.205,4.177-19.484,10.898-26.207v-0.009 C29.473,4.177,38.754,0,48.966,0C59.17,0,68.449,4.177,75.173,10.901l0.01,0.009c6.721,6.723,10.898,16.002,10.898,26.207v17.844 v1.075h7.136c1.59,0,2.892,1.302,2.892,2.891v61.062c0,1.589-1.302,2.891-2.892,2.891H2.892c-1.59,0-2.892-1.302-2.892-2.891 V58.927C0,57.338,1.302,56.036,2.892,56.036L2.892,56.036z M26.271,56.036h45.387v-1.075V36.911c0-6.24-2.554-11.917-6.662-16.03 l-0.005,0.004c-4.111-4.114-9.787-6.669-16.025-6.669c-6.241,0-11.917,2.554-16.033,6.665c-4.109,4.113-6.662,9.79-6.662,16.03 v18.051V56.036L26.271,56.036z M49.149,89.448l4.581,21.139l-12.557,0.053l3.685-21.423c-3.431-1.1-5.918-4.315-5.918-8.111 c0-4.701,3.81-8.511,8.513-8.511c4.698,0,8.511,3.81,8.511,8.511C55.964,85.226,53.036,88.663,49.149,89.448L49.149,89.448z" />
                      </g>
                    </svg>
                    <input type="password" name="password" ref={password} placeholder='Password' style={{ width: '100%' }} className="input champ" />
                  </div>

                  {isMfaRequired && (
                    <div className="d-flex input-group mb-5">
                      <svg style={{ marginRight: '20px' }} fill="#ffffff" width="20px" viewBox="0 0 24 24" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" enableBackground="new 0 0 96.108 122.88" xmlSpace="preserve">
                        <g>
                          <path fillRule="evenodd" clipRule="evenodd" d="M12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0ZM12 21.6C6.48583 21.6 2.4 17.5142 2.4 12C2.4 6.48583 6.48583 2.4 12 2.4C17.5142 2.4 21.6 6.48583 21.6 12C21.6 17.5142 17.5142 21.6 12 21.6ZM12.6001 7.20001H11.4001V12.5873L15.5655 14.9524L16.2001 13.8611L12.6001 11.8249V7.20001Z" />
                        </g>
                      </svg>
                      <input type="text" name="mfaCode" placeholder='MFA code' ref={mfaCode} style={{ width: '100%' }} className="input champ" />
                    </div>
                  )}
                  <button type="submit" id="bouton" className="btn btn-success form-control" disabled={isLoading}>{isLoading ? <Spinner animation="border" size="sm" /> : "Sign In"}</button>

                </form>
              </CardBody>
            </Card>
          </div>



        </Col>
      </Row>
      {/* <div style={{ width: "50%" }}>
        <Row className='d-flex justify-content-center align-items-center h-100'>
          <div>
            <h1>Welcome !</h1>
          </div>
        </Row>
      </div>
      <div style={{ width: "50%" }}>
        <Row className='d-flex justify-content-center align-items-center h-100'>
          <Col className="col-12">
            <Card className='bg-dark text-white my-5 mx-auto' style={{ borderRadius: '1rem', maxWidth: '400px' }}>
              <CardBody className='p-5 d-flex flex-column align-items-center mx-auto w-100'>
                <svg width="100px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12ZM15 9C15 10.6569 13.6569 12 12 12C10.3431 12 9 10.6569 9 9C9 7.34315 10.3431 6 12 6C13.6569 6 15 7.34315 15 9ZM12 20.5C13.784 20.5 15.4397 19.9504 16.8069 19.0112C17.4108 18.5964 17.6688 17.8062 17.3178 17.1632C16.59 15.8303 15.0902 15 11.9999 15C8.90969 15 7.40997 15.8302 6.68214 17.1632C6.33105 17.8062 6.5891 18.5963 7.19296 19.0111C8.56018 19.9503 10.2159 20.5 12 20.5Z" fill="#ffffff" />
                </svg>

                <form onSubmit={handleSubmit}>
                  <div className="d-flex input-group mb-5">
                    <svg style={{ marginRight: '20px' }} width="20px" viewBox="0 -3.5 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" xmlnssketch="http://www.bohemiancoding.com/sketch/ns">
                      <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd" sketchtype="MSPage">
                        <g id="Icon-Set-Filled" sketchtype="MSLayerGroup" transform="translate(-414.000000, -261.000000)" fill="#ffffff">
                          <path d="M430,275.916 L426.684,273.167 L415.115,285.01 L444.591,285.01 L433.235,273.147 L430,275.916 L430,275.916 Z M434.89,271.89 L445.892,283.329 C445.955,283.107 446,282.877 446,282.634 L446,262.862 L434.89,271.89 L434.89,271.89 Z M414,262.816 L414,282.634 C414,282.877 414.045,283.107 414.108,283.329 L425.147,271.927 L414,262.816 L414,262.816 Z M445,261 L415,261 L430,273.019 L445,261 L445,261 Z" id="mail" sketchtype="MSShapeGroup">

                          </path>
                        </g>
                      </g>
                    </svg>
                    <input type="email" name="email" placeholder='Email' ref={email} className="input champ" />
                  </div>
                  <div className="d-flex input-group mb-5">
                    <svg style={{ marginRight: '20px' }} fill="#ffffff" width="20px" viewBox="-13.39 0 122.88 122.88" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" enableBackground="new 0 0 96.108 122.88" xmlSpace="preserve">
                      <g>
                        <path fillRule="evenodd" clipRule="evenodd" d="M2.892,56.036h8.959v-1.075V37.117c0-10.205,4.177-19.484,10.898-26.207v-0.009 C29.473,4.177,38.754,0,48.966,0C59.17,0,68.449,4.177,75.173,10.901l0.01,0.009c6.721,6.723,10.898,16.002,10.898,26.207v17.844 v1.075h7.136c1.59,0,2.892,1.302,2.892,2.891v61.062c0,1.589-1.302,2.891-2.892,2.891H2.892c-1.59,0-2.892-1.302-2.892-2.891 V58.927C0,57.338,1.302,56.036,2.892,56.036L2.892,56.036z M26.271,56.036h45.387v-1.075V36.911c0-6.24-2.554-11.917-6.662-16.03 l-0.005,0.004c-4.111-4.114-9.787-6.669-16.025-6.669c-6.241,0-11.917,2.554-16.033,6.665c-4.109,4.113-6.662,9.79-6.662,16.03 v18.051V56.036L26.271,56.036z M49.149,89.448l4.581,21.139l-12.557,0.053l3.685-21.423c-3.431-1.1-5.918-4.315-5.918-8.111 c0-4.701,3.81-8.511,8.513-8.511c4.698,0,8.511,3.81,8.511,8.511C55.964,85.226,53.036,88.663,49.149,89.448L49.149,89.448z" />
                      </g>
                    </svg>
                    <input type="password" name="password" ref={password} placeholder='Password' className="input champ" />
                  </div>

                  {isMfaRequired && (
                    <div className="d-flex input-group mb-5">
                      <svg style={{ marginRight: '20px' }} fill="#ffffff" width="20px" viewBox="0 0 24 24" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" enableBackground="new 0 0 96.108 122.88" xmlSpace="preserve">
                        <g>
                          <path fillRule="evenodd" clipRule="evenodd" d="M12 0C5.37258 0 0 5.37258 0 12C0 18.6274 5.37258 24 12 24C18.6274 24 24 18.6274 24 12C24 5.37258 18.6274 0 12 0ZM12 21.6C6.48583 21.6 2.4 17.5142 2.4 12C2.4 6.48583 6.48583 2.4 12 2.4C17.5142 2.4 21.6 6.48583 21.6 12C21.6 17.5142 17.5142 21.6 12 21.6ZM12.6001 7.20001H11.4001V12.5873L15.5655 14.9524L16.2001 13.8611L12.6001 11.8249V7.20001Z" />
                        </g>
                      </svg>
                      <input type="text" name="mfaCode" placeholder='MFA code' ref={mfaCode} className="input champ" />
                    </div>
                  )}
                  <button type="submit" id="bouton" className="btn btn-success form-control" disabled={isLoading}>{isLoading ? <Spinner animation="border" size="sm" /> : "Sign In"}</button>

                </form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div> */}
      {/* <Row className="">
        <div className="mx-auto justify-content-center align-items-center">
          <img src={logo} alt="" style={{ width: "25%" }} />
        </div>
      </Row> */}

    </div>
  )
}

export default Auth