import { useState, useRef, useEffect } from 'react';
import { doc, updateDoc } from 'firebase/firestore';
import { useAuth } from '../../../contexts/AuthContext';
import { db, collection, onSnapshot } from '../../../firebase';
import { Link } from 'react-router-dom';

const NotificationDropdown = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const userId = user?.id;

  useEffect(() => {
    if (!userId) return;

    const unsubscribe = onSnapshot(
      collection(db, "notifications", String(userId), "user_notifications"),
      (snapshot) => {
        const allNotifications = snapshot.docs.map(doc => {
          const data = doc.data();
          let timestampMs = new Date(data.timestamp).getTime();
          return {
            id: doc.id,
            ...data,
            timestamp: timestampMs,
            formattedTimestamp: new Date(timestampMs).toLocaleString('en-US', {
              timeZone: 'Africa/Cairo',
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true
            }),
          };
        });

        const sortedNotifications = allNotifications.sort((a, b) => b.timestamp - a.timestamp);
        setNotifications(sortedNotifications);
      },
      (error) => {
        console.error("Error fetching notifications:", error);
      }
    );

    return () => unsubscribe();
  }, [userId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setShowDropdown((prev) => !prev)}
        className="p-2 rounded-full hover:bg-gray-100 transition-colors relative"
      >
        <span className="material-icons text-gray-600">notifications</span>
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 max-w-xs bg-white border border-gray-200 rounded-xl shadow-xl z-50">
          <div className="p-3 border-b text-gray-800 font-semibold">
            Notifications
          </div>
          {notifications.length === 0 ? (
            <div className="p-4 text-gray-500 text-sm text-center">
              No new notifications
            </div>
          ) : (
            <div className="max-h-64 overflow-y-auto">
              {notifications.slice(0, 16).map((notification) => (
                <div
                  key={notification.id}
                  className={`px-4 py-3 text-sm hover:bg-gray-50 cursor-pointer border-b last:border-b-0 ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <Link to={notification.type === 'application' ? `/applications/${notification.target_id}` : notification.type === 'achievement' ? `/achievements/${notification.target_id}` : '/articles/${notification.target_id}'}>
                  <div className="font-medium text-gray-800 flex justify-between items-center">
                    <span className={!notification.read ? 'font-bold' : ''}>
                      {notification.body}
                    </span>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {notification.formattedTimestamp}
                    </span>
                  </div>
                  </Link>
                  {!notification.read && (
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1"></div>
                  )}
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
