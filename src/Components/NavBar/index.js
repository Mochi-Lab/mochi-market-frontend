import { useEffect, useState } from 'react';

import { Drawer } from 'antd';
import LeftMenu from './LeftMenu';
import RightMenu from './RightMenu';
import { Link } from 'react-router-dom';
import logoMochi from 'Assets/logo-mochi.png';
import navbar from 'Assets/images/navbar.png';
import { MenuOutlined } from '@ant-design/icons';

export default function NavBar() {
  const [visible, setVisible] = useState(false);

  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };

  useEffect(() => {
    const hideDrawerOnWindowResize = () => {
      // mobile menu should be closed on desktop display mode
      let windowInnerWidth = window.innerWidth;
      if(windowInnerWidth > 992) onClose();
    }
    window.addEventListener("resize", hideDrawerOnWindowResize);
    return () => {
      window.removeEventListener("resize", hideDrawerOnWindowResize);
    }
  }, [])

  return (
    <nav className='menu-bar'>
      <div className='logo'>
        <Link to='/'>
          <img src={logoMochi} alt='logo' />
        </Link>
      </div>
      <div className='menuCon'>
        <div className='leftMenu'>
          <LeftMenu />
        </div>
        <div className='menu-triggerer-container'>
          <MenuOutlined onClick={showDrawer} />
        </div>
        <div className='rightMenu'>
          <RightMenu />
        </div>

        <Drawer
          bodyStyle={{ padding: 0 }}
          placement='right'
          closable={false}
          onClose={onClose}
          visible={visible}
          className="menu-bar-drawer"
        >
          <RightMenu onClose={onClose}/>
        </Drawer>
      </div>
      <img src={navbar} className='narbar-image' alt='navbar' />
    </nav>
  );
}
