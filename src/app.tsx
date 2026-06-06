import { useEffect } from 'react';
import { useDidShow, useDidHide } from '@tarojs/taro';
import { useUserStore } from '@/store/userStore';
import './app.scss';

function App(props) {
  const { initFromStorage, isLoggedIn } = useUserStore();

  useEffect(() => {
    initFromStorage();
  }, []);

  useDidShow(() => {
    initFromStorage();
  });

  useDidHide(() => {});

  return props.children;
}

export default App;
