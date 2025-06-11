"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "../../../styles/LibrarianDashboard.module.css";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LibrarianDashboard() {
  // your state and logic remains the same

  const [stats, setStats] = useState({});
  const [recentReservations, setRecentReservations] = useState([]);
  const [notifications, setNotifications] = useState([]);

  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/librarian/login");
    }
    // Mock data
    setStats({
      totalBooks: 156,
      totalStudents: 89,
      activeReservations: 23,
      overdue: 5,
      pendingRequests: 8,
    });

    setRecentReservations([
      {
        id: 1,
        studentName: "John Doe",
        bookName: "Clean Code",
        requestDate: "2024-05-20",
        status: "pending",
      },
      {
        id: 2,
        studentName: "Jane Smith",
        bookName: "Effective Java",
        requestDate: "2024-05-19",
        status: "approved",
      },
      {
        id: 3,
        studentName: "Mike Johnson",
        bookName: "Algorithms",
        requestDate: "2024-05-18",
        status: "pending",
      },
    ]);

    setNotifications([
      {
        id: 1,
        message: "New reservation request from John Doe",
        type: "request",
        time: "10 minutes ago",
      },
      {
        id: 2,
        message: "5 books are overdue",
        type: "warning",
        time: "1 hour ago",
      },
      {
        id: 3,
        message: "System backup completed",
        type: "info",
        time: "2 hours ago",
      },
    ]);
  }, [status, router]);

  const handleLogout = async () => {
    if (confirm("Are you sure you want to logout?")) {
      try {
        const signOutRes = await signOut();
        // console.log("sign out heeee ");
        console.log(signOutRes);
        window.location.href = "/";
      } catch (err) {
        console.log("error while signing out: ", err.message);
      }
    }
  };

  const handleApproveReservation = (id) => {
    setRecentReservations((prev) =>
      prev.map((reservation) =>
        reservation.id === id
          ? { ...reservation, status: "approved" }
          : reservation
      )
    );
    alert("Reservation approved!");
  };

  const handleRejectReservation = (id) => {
    setRecentReservations((prev) =>
      prev.map((reservation) =>
        reservation.id === id
          ? { ...reservation, status: "rejected" }
          : reservation
      )
    );
    alert("Reservation rejected!");
  };

  if (status === "loading") {
    return <p>Loading...</p>;
  }
  // Don't render dashboard if session is not ready
  if (!session) {
    return null; // Or a loading screen/spinner
  }
  if (session?.user.role !== "librarian") {
    router.push("/student/dashboard");
    return null;
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div>
            <h1 className={styles.headerTitle}>👨‍💼 Librarian Dashboard</h1>
            <p className={styles.headerSubtitle}>Welcome back, Admin</p>
          </div>
          <div className={styles.headerButtons}>
            <Link href="/librarian/books" className={styles.button}>
              Manage Books
            </Link>
            <Link href="/librarian/reservations" className={styles.button}>
              Reservations
            </Link>
            <button
              onClick={handleLogout}
              className={`${styles.button} ${styles.secondary}`}
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className={styles.mainContent}>
        {/* Stats Cards */}
        <div className={styles.statsGrid}>
          <div className={`${styles.statCard} ${styles.statBooks}`}>
            <h3 className={styles.statNumber}>{stats.totalBooks}</h3>
            <p className={styles.statLabel}>Total Books</p>
          </div>
          <div className={`${styles.statCard} ${styles.statStudents}`}>
            <h3 className={styles.statNumber}>{stats.totalStudents}</h3>
            <p className={styles.statLabel}>Registered Students</p>
          </div>
          <div className={`${styles.statCard} ${styles.statActive}`}>
            <h3 className={styles.statNumber}>{stats.activeReservations}</h3>
            <p className={styles.statLabel}>Active Reservations</p>
          </div>
          <div className={`${styles.statCard} ${styles.statOverdue}`}>
            <h3 className={styles.statNumber}>{stats.overdue}</h3>
            <p className={styles.statLabel}>Overdue Books</p>
          </div>
          <div className={`${styles.statCard} ${styles.statPending}`}>
            <h3 className={styles.statNumber}>{stats.pendingRequests}</h3>
            <p className={styles.statLabel}>Pending Requests</p>
          </div>
        </div>

        <div className={styles.contentGrid}>
          {/* Recent Reservations */}
          <section className={styles.card}>
            <h2>📋 Recent Reservation Requests</h2>
            {recentReservations.map((reservation) => (
              <div key={reservation.id} className={styles.reservationItem}>
                <div className={styles.reservationDetails}>
                  <h4>{reservation.bookName}</h4>
                  <p>Student: {reservation.studentName}</p>
                  <p className={styles.requestDate}>
                    Requested: {reservation.requestDate}
                  </p>
                </div>
                <div>
                  <span
                    className={`${styles.statusBadge} ${
                      reservation.status === "pending"
                        ? styles.statusPending
                        : reservation.status === "approved"
                        ? styles.statusApproved
                        : styles.statusRejected
                    }`}
                  >
                    {reservation.status}
                  </span>
                  {reservation.status === "pending" && (
                    <div className={styles.reservationActions}>
                      <button
                        onClick={() => handleApproveReservation(reservation.id)}
                        className={`${styles.reservationButton} ${styles.approveButton}`}
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectReservation(reservation.id)}
                        className={`${styles.reservationButton} ${styles.rejectButton}`}
                      >
                        Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </section>

          {/* Notifications */}
          <aside className={styles.card}>
            <h2>🔔 Notifications</h2>
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`${styles.notificationItem} ${
                  notification.type === "request"
                    ? styles.notificationRequest
                    : notification.type === "warning"
                    ? styles.notificationWarning
                    : styles.notificationInfo
                }`}
              >
                <p className={styles.notificationMessage}>
                  {notification.message}
                </p>
                <p className={styles.notificationTime}>{notification.time}</p>
              </div>
            ))}
          </aside>
        </div>
      </main>
    </div>
  );
}
