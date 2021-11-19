import React, { Suspense } from 'react'
import {
  Redirect,
  Route,
  Switch
} from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  CCreateElement,
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarNavDivider,
  CSidebarNavTitle,
  CSidebarNavDropdown,
  CSidebarNavItem,
  CHeader,
  CToggler,
  CHeaderBrand,
  CHeaderNav,
  CHeaderNavItem,
  CHeaderNavLink,
  CFooter,
  CContainer, 
  CFade,
} from '@coreui/react'

import mainRoutes from '../../../routes'
import { routes } from './routes'

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
)

const Dashboard = () => {
  const dispatch = useDispatch()

  // Check user logged
  const user = useSelector(({ user }) => user)
  if (!user) {
    return (
      <Redirect to="/" />
    )
  }
  // / Check user logged

  const handleLogout = (e) => {
    e.preventDefault();

    dispatch({ type: 'set', user: undefined })
  }

  const TheSidebar = () => {
    const show = useSelector(state => state.sidebarShow)
  
    return (
      <CSidebar
        show={show}
        onShowChange={(val) => dispatch({type: 'set', sidebarShow: val })}
      >
        <CSidebarBrand className="d-md-down-none" to="/dashboard/report">
          <strong>SMARTCARE</strong>
        </CSidebarBrand>
        <CSidebarNav>
  
          <CCreateElement
            items={routes}
            components={{
              CSidebarNavDivider,
              CSidebarNavDropdown,
              CSidebarNavItem,
              CSidebarNavTitle
            }}
          />
        </CSidebarNav>
      </CSidebar>
    )
  }

  const TheHeader = () => {
    const dispatch = useDispatch()
    const sidebarShow = useSelector(state => state.sidebarShow)
  
    const toggleSidebar = () => {
      const val = [true, 'responsive'].includes(sidebarShow) ? false : 'responsive'
      dispatch({type: 'set', sidebarShow: val})
    }
  
    const toggleSidebarMobile = () => {
      const val = [false, 'responsive'].includes(sidebarShow) ? true : 'responsive'
      dispatch({type: 'set', sidebarShow: val})
    }
  
    return (
      <CHeader withSubheader>
        <CToggler
          inHeader
          className="ml-md-3 d-lg-none"
          onClick={toggleSidebarMobile}
        />
        <CToggler
          inHeader
          className="ml-3 d-md-down-none"
          onClick={toggleSidebar}
        />
        <CHeaderBrand className="mx-auto d-lg-none" to="/">
          <strong>SMARTCARE</strong>
        </CHeaderBrand>
  
        <CHeaderNav className="d-md-down-none mr-auto">
          <CHeaderNavItem className="px-3" >
            <CHeaderNavLink href="https://raphael-abreu.github.io/projects/smartCare/" target="_blank">Documentação</CHeaderNavLink>
          </CHeaderNavItem>
          <CHeaderNavItem className="px-3" >
            <CHeaderNavLink onClick={handleLogout}>Sair</CHeaderNavLink>
          </CHeaderNavItem>
        </CHeaderNav>
      </CHeader>
    )
  }

  const TheContent = () => {
    return (
      <main className="c-main">
        <CContainer fluid>
          <Suspense fallback={loading}>
            <Switch>
              {mainRoutes.map((route, idx) => {
                return route.component && (
                  <Route
                    key={idx}
                    path={route.path}
                    exact={route.exact}
                    name={route.name}
                    render={props => (
                      <CFade>
                        <route.component {...props} />
                      </CFade>
                    )} />
                )
              })}
              <Redirect from="/" to="/dashboard/report" />
            </Switch>
          </Suspense>
        </CContainer>
      </main>
    )
  }

  const TheFooter = () => {
    return (
      <CFooter fixed={false}>
        <div className="mfs-auto">
          <span className="mr-1">&nbsp;&nbsp;&nbsp;&copy; 2021 TCC Izaú Barbosa.</span>
        </div>
      </CFooter>
    )
  }

  return (
    <div className="c-app c-default-layout">
      <TheSidebar/>
      <div className="c-wrapper">
        <TheHeader/>
        <div className="c-body">
          <TheContent/>
        </div>
        <TheFooter/>
      </div>
    </div>
  )
}

export default Dashboard