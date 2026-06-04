import { useEffect, useState } from "react";
import api from "../../services/api";

export default function Questions() {

  const [departments,setDepartments] =
    useState([]);

  const [departmentId,setDepartmentId] =
    useState("");

  const [question,setQuestion] =
    useState("");

  const [type,setType] =
    useState("text");

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments =
  async () => {

    const res =
      await api.get("/departments");

    setDepartments(
      res.data
    );
  };

  const saveQuestion =
  async () => {

    await api.post(
      "/questions",
      {
        departmentId,

        code:
          "Q_" +
          Date.now(),

        type,

        question:{
          en:question,
          hi:question,
          gu:question
        },

        required:true,

        active:true
      }
    );

    alert(
      "Question Added"
    );

    setQuestion("");
  };

  return (
    <div
      style={{
        maxWidth:"900px",
        margin:"20px auto"
      }}
    >

      <h1>
        Question Management
      </h1>

      <select
        value={departmentId}
        onChange={(e)=>
          setDepartmentId(
            e.target.value
          )
        }
      >

        <option value="">
          Select Department
        </option>

        {
          departments.map(
            dept=>(
              <option
                key={dept._id}
                value={dept._id}
              >
                {
                  dept.title.en
                }
              </option>
            )
          )
        }

      </select>

      <br/><br/>

      <select
        value={type}
        onChange={(e)=>
          setType(
            e.target.value
          )
        }
      >
        <option value="text">
          Text
        </option>

        <option value="textarea">
          Textarea
        </option>

        <option value="scale">
          Scale
        </option>

        <option value="singleSelect">
          Single Select
        </option>

        <option value="multiSelect">
          Multi Select
        </option>

        <option value="voice">
          Voice Response
        </option>

        <option value="file">
          File Upload
        </option>

      </select>

      <br/><br/>

      <textarea
        rows="5"
        value={question}
        onChange={(e)=>
          setQuestion(
            e.target.value
          )
        }
        placeholder="Enter Question"
      />

      <br/><br/>

      <button
        onClick={
          saveQuestion
        }
      >
        Add Question
      </button>

    </div>
  );
}