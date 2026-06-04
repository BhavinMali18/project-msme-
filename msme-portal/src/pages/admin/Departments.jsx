import { useEffect, useState } from "react";
import api from "../../services/api";

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [name, setName] = useState("");

  const loadDepartments = async () => {
    try {
      const res = await api.get("/departments");

      setDepartments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  const createDepartment = async () => {
    if (!name.trim()) return;

    try {
      await api.post("/departments", {
        code: name.toLowerCase().replace(/\s+/g, "_"),

        title: {
          en: name,
          hi: name,
          gu: name,
        },

        order: departments.length + 1,

        active: true,
      });

      setName("");

      loadDepartments();
    } catch (err) {
      console.error(err);
    }
  };
  const deleteDepartment = async (id) => {
  try {
    await api.delete(
      `/departments/${id}`
    );

    loadDepartments();

  } catch (err) {
    console.error(err);
  }
};



  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "30px auto",
        padding: "20px",
      }}
    >
      <h1>Department Management</h1>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "20px",
        }}
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Department Name"
          style={{
            padding: "10px",
            flex: 1,
          }}
        />

        <button onClick={createDepartment}>
          Add Department
        </button>
      </div>

      <table
        border="1"
        cellPadding="10"
        width="100%"
      >
        <thead>
          <tr>
            <th>#</th>
            <th>Department</th>
            <th>Code</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {departments.map((dept, index) => (
            <tr key={dept._id}>
              <td>{index + 1}</td>
              <td>{dept.title?.en}</td>
              <td>{dept.code}</td>
              <td>
                {dept.active
                  ? "Active"
                  : "Inactive"}
              </td>
              <td>
  {dept.active ? "Active" : "Inactive"}
</td>

<td>
  <button
    onClick={() =>
      deleteDepartment(dept._id)
    }
    style={{
      background: "red",
      color: "white",
      border: "none",
      padding: "8px 12px",
      cursor: "pointer",
    }}
  >
    Delete
  </button>
</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}