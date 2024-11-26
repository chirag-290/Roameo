import React from 'react'
import '../styles/home.css'
import { Container, Row, Col } from 'reactstrap'
import SearchBar from './../shared/SearchBar'
import FeaturedTourList from '../components/Featured-tours/FeaturedTourList'

const Home = () => {
   return (
      <>
         
         <section>
            <Container>
               <Row>
                  <SearchBar />
               </Row>
            </Container>
         </section>
         <section>
            <Container>
               <Row>
                  <Col lg='12' className='mb-5'>
                     <h2 className='featured__tour-title'>Our Featured Tours</h2>
                  </Col>
                  <FeaturedTourList />
               </Row>
            </Container>
         </section>
      </>
   )
}

export default Home
