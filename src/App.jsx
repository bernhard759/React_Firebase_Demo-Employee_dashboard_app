import React, { useState, useEffect } from "react";
import { auth, fsDb, rDatabase } from "./firebase-config";
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { ref, update, onValue, remove } from "firebase/database";
import Auth from "./Auth";
import EmployeeCategoryChart from "./EmployeeCategoryChart"; // Import the chart component
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  // user state
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Emps state (firestore)
  const [newName, setNewName] = useState("");
  const [newMarks, setNewMarks] = useState(0);
  const [emps, setEmps] = useState([]);
  const empsCollectionRef = collection(fsDb, "employees");

  // Categories state (realtime db)
  const [newCategories, setNewCategories] = useState({});
  const [categories, setCategories] = useState({});

  // Logout function
  const handleLogout = async () => {
    try {
      await auth.signOut();
      setUser(null);
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  };

  // Create employee
  const createEmp = async () => {
    if (newName == "") return;
    await addDoc(empsCollectionRef, {
      name: newName,
      marks: Number(newMarks),
    });
  };

  // Update employee
  const updateEmp = async (id, marks) => {
    const empDoc = doc(fsDb, "employees", id);
    const newFields = { marks: marks + 1 };
    await updateDoc(empDoc, newFields);
  };

  // Delete employee
  const deleteEmp = async (id) => {
    const empDoc = doc(fsDb, "employees", id);
    await deleteDoc(empDoc);

    const categoryRef = ref(rDatabase, `categories/${id}`);
    await remove(categoryRef);
  };

  // Assign category to employee in Realtime Database
  const assignCategory = async (empId) => {
    const newCategory = newCategories[empId];
    if (!empId || !newCategory) return;

    const categoryId = `category_${Date.now()}`;
    const categoryRef = ref(rDatabase, `categories/${empId}`);
    await update(categoryRef, {
      [categoryId]: newCategory,
    });

    setNewCategories((prev) => ({ ...prev, [empId]: "" }));
  };

  // Delete a category for an employee
  const deleteCategory = async (empId, categoryId) => {
    const categoryRef = ref(rDatabase, `categories/${empId}/${categoryId}`);
    await remove(categoryRef);
  };

  // Handle category input change for specific employee
  const handleCategoryChange = (empId, value) => {
    setNewCategories((prev) => ({ ...prev, [empId]: value }));
  };

  // User auth
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Set up real-time listener for employees
  useEffect(() => {
    if (user) {
      const unsubscribe = onSnapshot(empsCollectionRef, (snapshot) => {
        setEmps(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      });

      return () => unsubscribe();
    }
  }, [user]);

  // Set up a single listener for all categories
  useEffect(() => {
    if (user) {
      const categoriesRef = ref(rDatabase, `categories`);

      const unsubscribe = onValue(categoriesRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setCategories(data);
        } else {
          setCategories({});
        }
      });

      return () => unsubscribe();
    }
  }, [user]);

  // Show loading component
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Return auth component if user is not logged in
  if (!user) {
    return <Auth />;
  }

  // Dashboard markup
  return (
    <>
      <header className="text-center m-5 position-relative">
        <h1>My Super Cool Dashboard</h1>
        <button
          onClick={handleLogout}
          className="btn btn-danger position-absolute top-0 end-0 m-3"
        >
          Logout
        </button>
      </header>
      <div className="container mt-5">
        <div className="card mb-5 p-4 shadow">
          <h2>Add Employee</h2>
          <div className="row">
            <div className="col-md-6 mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Name..."
                onChange={(event) => setNewName(event.target.value)}
              />
            </div>
            <div className="col-md-6 mb-3">
              <input
                type="number"
                className="form-control"
                placeholder="Marks..."
                onChange={(event) => setNewMarks(event.target.value)}
              />
            </div>
            <div className="col-12">
              <button onClick={createEmp} className="btn btn-primary w-100">
                Create Employee
              </button>
            </div>
          </div>
        </div>

        <div className="row">
          {/* Employee infos */}
          <div className="col-lg-6">
            <div className="card p-4 shadow mb-5">
              <h2>Employee List</h2>
              <div className="list-group">
                {emps.map((emp) => (
                  <div key={emp.id} className="list-group-item">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h5>{emp.name}</h5>
                        <p>Marks: {emp.marks}</p>
                        <p>Categories:</p>
                        <ul>
                          {categories[emp.id] &&
                            Object.values(categories[emp.id]).map(
                              (cat, idx) => <li key={idx}>{cat}</li>
                            )}
                        </ul>
                      </div>
                      <div>
                        <button
                          onClick={() => updateEmp(emp.id, emp.marks)}
                          className="btn btn-sm btn-outline-success me-2"
                        >
                          Increase Marks
                        </button>
                        <button
                          onClick={() => deleteEmp(emp.id)}
                          className="btn btn-sm btn-outline-danger"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="mt-3">
                      <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="New Category"
                        value={newCategories[emp.id] || ""}
                        onChange={(e) =>
                          handleCategoryChange(emp.id, e.target.value)
                        }
                      />
                      <button
                        onClick={() => assignCategory(emp.id)}
                        className="btn btn-sm btn-outline-primary"
                      >
                        Add Category
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="col-lg-6">
            <div className="card p-4 shadow mb-5">
              <h2>Categories</h2>
              <ul className="list-group">
                {emps.map((emp) => (
                  <li key={emp.id} className="list-group-item">
                    <h5>Employee: {emp.name}</h5>
                    <ul>
                      {categories[emp.id] &&
                      Object.values(categories[emp.id]).length > 0 ? (
                        Object.entries(categories[emp.id]).map(
                          ([categoryId, category], idx) => (
                            <li
                              key={idx}
                              className="d-flex justify-content-between align-items-center"
                              style={{ position: "relative" }}
                            >
                              {category}
                              <button
                                className="btn btn-sm btn-outline-danger"
                                style={{ marginLeft: "10px" }}
                                onClick={() =>
                                  deleteCategory(emp.id, categoryId)
                                }
                              >
                                &times;
                              </button>
                            </li>
                          )
                        )
                      ) : (
                        <li>No categories assigned</li>
                      )}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Chart */}
          <div className="col-lg-6">
            <EmployeeCategoryChart emps={emps} categories={categories} />
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
