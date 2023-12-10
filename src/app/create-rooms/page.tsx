import styles from './styles.module.css';
import Section_CreateRooms from './_sections/Section_CreateRooms';


const UserProfilePage = () => {
  return (
    <main className={`${styles.pageBody}`}>
        <Section_CreateRooms />
    </main>
  );
};

export default UserProfilePage;
