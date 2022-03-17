import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Button  from 'react-bootstrap/Button'
import { useAuth } from "../lib/auth";

export default function Header() {
    const {user, loading, signOut} = useAuth();
    return (      
        <Navbar bg="light" expand="lg">
            <Container>
          <Navbar.Brand href="#home">SAT/ACT Group</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link href="/">Classes</Nav.Link>
              <Nav.Link href="/dashboard">Dashboard</Nav.Link>
              {user ? (
                <Button onClick={signOut}>Sign Out</Button>
              ) : (
                <Button href="/sign-in">Sign In</Button>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    )
}