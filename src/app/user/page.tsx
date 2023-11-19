import styles from './styles.module.css';
import Section_UserProfile from './_sections/Section_UserProfile';
import Section_CreateRooms from './_sections/Section_CreateRooms';


const UserProfilePage = () => {
  return (
    <main className={`${styles.pageBody}`}>
        <Section_UserProfile />
        <Section_CreateRooms />
    </main>
  );
};

export default UserProfilePage;
