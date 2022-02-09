import React from 'react';
import logo from './logo.svg';
import styles from "./App.module.css";
import {Header,Footer} from "./components"

function App() {
  return (
    <div className={styles.App}>
      <Header></Header>
      <Footer></Footer>
    </div>
  );
}

export default App;
