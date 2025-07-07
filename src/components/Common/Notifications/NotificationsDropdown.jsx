import { useState, useRef, useEffect } from 'react';
import { doc, updateDoc} from 'firebase/firestore';
import { useAuth } from '../../../contexts/AuthContext';
import { db, collection, onSnapshot } from '../../../firebase';


const NotificationDropdown = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const {user} = useAuth();
  const [notifications, setNotifications] = useState([]);
  const userId = user?.id;

    // Fetch notifications from Firestore
    useEffect(() => {
      console.log("Fetching notifications for user:", userId);
      if (!userId) return; 
      const unsubscribe = onSnapshot(collection
        (db, "notifications", String(userId), "user_notifications"),
        (snapshot) => {
          const newNotifications = [];
  
          snapshot.docChanges().forEach((change)=> {
            if(change.type === "added") {
              newNotifications.push({id: change.doc.id, ...change.doc.data()});
            }
          })
  
          if (newNotifications.length > 0) {
            setNotifications((prev) => [...prev, ...newNotifications]);
          }
        }
      )
      return () => unsubscribe();
      }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }}, []);

  const markAsRead = async (notifyId) => {
    try {
      await updateDoc(doc(db, "notifications", String(userId), "user_notifications", notifyId), {
        read: true,
      });
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notifyId ? { ...n, read: true } : n
        )
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  }
  const unreadCount = notifications.filter((n) => !n.read).length;

  console.log("Notifications:", notifications);


  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown((prev) => !prev)}
        className="relative flex items-center text-gray-500 hover:text-[#901b20] focus:outline-none"
      >
        <span className="material-icons text-lg xl:text-xl">notifications_none</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 max-w-xs bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="p-3 border-b text-gray-800 font-semibold">
            Notifications
          </div>
          {notifications.length === 0 ? (
            <div className="p-4 text-gray-500 text-sm text-center">
              No new notifications
            </div>
          ) : (
            <div className="max-h-64 overflow-y-auto">
              {notifications.sort((a, b) => b.timestamp - a.timestamp).map((notification, index) => (
                <div
                  key={index}
                  className="px-4 py-3 text-sm hover:bg-gray-100 cursor-pointer border-b last:border-b-0"
                  onClick = {() => markAsRead(notification.id)}
                >

<div className="font-medium text-gray-800 flex justify-between items-center">
  <span>{notification.title}</span>
  <span className="text-xs text-gray-500 whitespace-nowrap">
    {new Date(notification.timestamp).toLocaleString()}
  </span>
</div>
                  <div className="text-gray-600">{notification.body}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
