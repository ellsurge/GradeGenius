import { Button, Input, Modal, Select, message } from "antd";
import AntdTable from "../../components/AntdTable";
import { useEffect, useState } from "react";
import {
  DeleteOutlined,
  PlusCircleFilled,
  UploadOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import API_URL from "../../apiUrl";
import { fetcher, download } from "../../_services";
import { setStudentActivities } from "../../store/store";

const MyActivity = () => {
  const apiUrl = API_URL;

  const columns = [
    {
      title: "Course Name",
      render(item) {
        const course = myCourses.find(
          (course) => course._id === item.course._id
        );
        return course ? course.title : "";
      },
    },
    {
      title: "Student Name",
      render(item) {
        return item.student?.name || "";
      },
    },
    {
      title: "Notes",
      render(item) {
        return item.notes ? item.notes.length : 0;
      },
    },
    {
      title: "Grade",
      render(item) {
        return item.grade || "--";
      },
    },
    {
      title: "Created At",
      render(item) {
        return item.createdAt ? item.createdAt.split("T")[0] : "";
      },
    },
    {
      title: "Files",
      render(item) {
        const files =
          item.filePaths && item.filePaths.length > 0
            ? JSON.parse(item.filePaths)
            : [];

        return files.length;
      },
    },
    {
      title: "Actions",
      render(item) {
        return (
          <>
            <Button
              onClick={() => {
                setShowViewModal(true);
                setSelectedLesson(item);
              }}
              className="bg-success text-white"
            >
              View Response
            </Button>
            <Button
              className="ms-2"
              onClick={() => {
                setShowViewExamModal(true);
                setSelectedLesson(item);
              }}
            >
              Grade Response
            </Button>
          </>
        );
      },
    },
  ];

  const allCourses = useSelector((state) => state.myReducer.courses);
  const allLessons = useSelector((state) => state.myReducer.lessons);
  const allActivity = useSelector((state) => state.myReducer.studentActivities);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (error) message.error("Fetching Data Error !");
  }, [error]);

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  const myCourses = allCourses.filter((course) =>
    course.teachers.includes(currentUser._id)
  );

  const myLessons = allLessons.filter(
    (lesson) => lesson.uploadedBy === currentUser._id
  );
  const myActivity = allActivity.filter((activity) => {
    return myLessons.some((lesson) => lesson._id === activity.lesson._id);
  });

  const [filteredActivities, setFilteredActivites] = useState(myActivity);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showAddGradeModal, setShowAddGradeModal] = useState(false);
  const [showViewExamModal, setShowViewExamModal] = useState(false);
  const [filterBy, setFilterBy] = useState("name");
  const [filterCondition, setFilterCondition] = useState("");
  const [newLesson, setNewLesson] = useState({
    course: "",
    title: "",
    files: [],
  });
  const [newActivity, setNewActivity] = useState({
    title: "",
    files: [],
    grade: "",
  });
  const [selectedActivity, setSelectedLesson] = useState(null);

  const handleFileChange = (e, type) => {
    const file = e.target.files;

    if (type === "lesson") {
      const files = newLesson.files;
      files.push(file);
      setNewLesson({ ...newLesson, files: files });
    } else {
      const files = newActivity.files;
      files.push(file);
      setNewActivity({ ...newActivity, files: files });
    }
  };

  const handleRemoveFile = (fileToRemove, type) => {
    if (type === "lesson") {
      const files = newLesson.files;
      const filteredFiles = files.filter((file) => file !== fileToRemove);
      setNewLesson({ ...newLesson, files: filteredFiles });
    } else {
      const files = newActivity.files;
      const filteredFiles = files.filter((file) => file !== fileToRemove);
      setNewActivity({ ...newActivity, files: filteredFiles });
    }
  };

  const handleSubmit = () => {
    const filePaths = newLesson.files.map((file) => file[0].name);
    const formData = new FormData();
    newLesson.files.map((file) => {
      formData.append("files", file[0]);
    });
    formData.append("course", newLesson.course);
    formData.append("title", newLesson.title);
    formData.append(
      "uploadedBy",
      JSON.parse(localStorage.getItem("currentUser"))._id
    );
    formData.append("filePaths", JSON.stringify(filePaths));
    fetch(`${apiUrl}/upload-lesson`, {
      method: "post",
      body: formData,
    })
      .then((res) => res.json())
      .then((res) => {
        setNewLesson({});
        setShowAddModal(false);
      })
      .catch((err) => {
        console.log("error", err);
        setError(true);
      });
  };

  const handleExamSubmit = () => {
    const newNote = { grade: newActivity.grade };
    fetch(`${apiUrl}/update-student-activity/${selectedActivity._id}`, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newNote),
    })
      .then((res) => res.json())
      .then((res) => {
        setNewActivity({});
        setShowViewExamModal(false);
        message.success("Grade Added Successfully !");
      })
      .catch((err) => {
        console.log("error", err);
        setError(true);
      });
  };

  const filterData = () => {
    const filtered =
      filterBy === "name"
        ? myActivity &&
          myActivity.filter((activity) =>
            activity.student.name
              .toLowerCase()
              .includes(filterCondition.toLowerCase())
          )
        : myActivity.filter(
            (activity) => activity.course._id === filterCondition
          );
    setFilteredActivites(filtered);
  };

  useEffect(() => {
    if (!filterCondition) {
      // console.log(myActivity);
      setFilteredActivites(myActivity);
    } else filterData();
  }, [filterCondition]);

  return (
    <div className="w-100">
      <h5 className="text-center">My Activity</h5>
      <div
        className="mx-auto d-flex align-items-center justify-content-end p-2"
        style={{ minHeight: "2rem", maxWidth: "80%" }}
      >
        <div
          className="d-flex flex-column flex-md-row justify-content-center justify-content-md-end"
          style={{ maxWidth: "50%" }}
        >
          <div
            className="d-flex align-items-center justify-content-center"
            style={{ maxWidth: "10rem" }}
          >
            <small>Filter By : </small>
            <Select
              value={filterBy}
              className="ms-2"
              onChange={(val) => {
                setFilterBy(val);
                setFilterCondition("");
              }}
            >
              <Select.Option value="name">Name</Select.Option>
              <Select.Option value="course">Course</Select.Option>
            </Select>
          </div>
          <div
            className="d-flex align-items-center ms-2 mt-2 mt-md-0"
            style={{ maxWidth: "10rem" }}
          >
            {filterBy === "name" && (
              <Input
                onChange={(e) => {
                  setFilterCondition(e.target.value);
                }}
                value={filterCondition}
              />
            )}
            {filterBy === "course" && (
              <Select
                className="w-100"
                value={filterCondition}
                onChange={(val) => {
                  setFilterCondition(val);
                }}
              >
                {myCourses.map((course) => (
                  <Select.Option value={course._id}>
                    {course.title}
                  </Select.Option>
                ))}
              </Select>
            )}
          </div>
        </div>
      </div>
      <AntdTable columns={columns} data={filteredActivities} width="80%" />
      <Modal
        open={showAddModal}
        maskClosable={false}
        title="Upload Lesson"
        onCancel={() => {
          setShowAddModal(false);
        }}
        style={{ width: "80%" }}
        footer={[]}
      >
        {showAddModal && (
          <div className="w-100 d-flex flex-column">
            <label htmlFor="course">Select Course</label>
            <Select
              id="course"
              value={newLesson.course}
              onChange={(val) => {
                setNewLesson({ ...newLesson, course: val });
              }}
            >
              {myCourses.length > 0 &&
                myCourses.map((course) => (
                  <Select.Option value={course._id}>
                    {course.title}
                  </Select.Option>
                ))}
            </Select>
            <label htmlFor="course" className="mt-2">
              Give your lesson a titles
            </label>
            <Input
              value={newLesson.title}
              onChange={(e) => {
                setNewLesson({ ...newLesson, title: e.target.value });
              }}
            />
            <label className="mt-2">Attach Files</label>
            <Button
              onClick={() => {
                document.getElementById("attachLesson").click();
              }}
              style={{ maxWidth: "10rem" }}
              icon={<UploadOutlined />}
              className="bg-success text-white"
            >
              {newLesson.files?.length > 0 ? "Add File" : "Upload"}
            </Button>
            <div className="w-100 d-flex flex-column">
              <small>Uploaded Files :</small>
              {newLesson.files.length > 0 ? (
                <ul>
                  {newLesson.files.map((file) => (
                    <li className="d-flex align-items-center">
                      <p className="text-truncate m-0" style={{ width: "80%" }}>
                        {file[0].name}
                      </p>
                      <Button
                        onClick={() => handleRemoveFile(file, "lesson")}
                        type="text"
                        className="text-danger ms-3 d-flex justify-content-center align-items-center"
                      >
                        <DeleteOutlined />
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No File Uploaded!</p>
              )}
            </div>
            <Button
              onClick={(e) => handleSubmit(e, "lesson")}
              type="primary"
              className="mx-auto"
              style={{ width: "40%" }}
            >
              Finish
            </Button>
            <input
              id="attachLesson"
              onChange={(e) => handleFileChange(e, "lesson")}
              hidden
              type="file"
              multiple
            />
          </div>
        )}
      </Modal>
      <Modal
        open={showViewModal}
        maskClosable={false}
        title="View Lesson"
        onCancel={() => {
          setShowViewModal(false);
        }}
        style={{ width: "80%" }}
        footer={[]}
      >
        {showViewModal && (
          <ul>
            <li>
              Course Name :{" "}
              {
                myCourses.filter(
                  (course) => course._id == selectedActivity.course
                )[0].title
              }
            </li>
            <li>
              Course ID :{" "}
              {
                myCourses.filter(
                  (course) => course._id === selectedActivity.course
                )[0].id
              }
            </li>
            <li>
              notes :{" "}
              {selectedActivity.notes.map((note) => (
                //notes has subjct and content
                <div className="container">
                  <div className="row">
                    <div className="col-12">
                      <div className="card mb-3">
                        <div className="card-body">
                          <h5 className="card-title">{note.subject}</h5>
                          <p className="card-text">{note.content}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </li>
            <li>
              Uploaded in :{" "}
              {selectedActivity.createdAt &&
                selectedActivity.createdAt.split("T")[0]}
            </li>
            <li>
              Attached Files :
              {selectedActivity.filePaths.length > 0 &&
                JSON.parse(selectedActivity.filePaths).map((file) => (
                  <small className="d-block">
                    {file}&nbsp;&nbsp;
                    <a
                      onClick={() => download(file)}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                    >
                      Download
                    </a>
                  </small>
                ))}
            </li>
          </ul>
        )}
      </Modal>
      <Modal
        open={showAddGradeModal}
        maskClosable={false}
        title="Add Exams and Questions"
        onCancel={() => {
          setShowAddGradeModal(false);
        }}
        style={{ width: "80%" }}
        footer={[]}
      >
        {showAddGradeModal && (
          <div className="w-100 d-flex flex-column">
            <p className="m-0">
              Selected Lesson : <b>{selectedActivity.title}</b>
            </p>
            <hr className="m-0" />
            <label className="mt-2">Give a title for the Exam / Question</label>
            <Input
              value={newActivity.title}
              onChange={(e) => {
                setNewActivity({ ...newActivity, title: e.target.value });
              }}
            />
            <label className="mt-2">Attach Files</label>
            <Button
              onClick={() => {
                document.getElementById("attachFile").click();
              }}
              style={{ maxWidth: "10rem" }}
              icon={<UploadOutlined />}
              className="bg-success text-white"
            >
              {newActivity.files?.length > 0 ? "Add File" : "Upload"}
            </Button>
            <div className="w-100 d-flex flex-column">
              <small>Uploaded Files :</small>
              {newActivity.files?.length > 0 ? (
                <ul>
                  {newActivity.files.map((file) => (
                    <li className="d-flex align-items-center">
                      <p className="text-truncate m-0" style={{ width: "80%" }}>
                        {file[0].name}
                      </p>
                      <Button
                        onClick={() => handleRemoveFile(file, "exam")}
                        type="text"
                        className="text-danger ms-3 d-flex justify-content-center align-items-center"
                      >
                        <DeleteOutlined />
                      </Button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No File Uploaded!</p>
              )}
            </div>
            <Button
              onClick={(e) => handleExamSubmit(e, "exam")}
              type="primary"
              className="mx-auto"
              style={{ width: "40%" }}
            >
              Finish
            </Button>
            <input
              id="attachFile"
              onChange={handleFileChange}
              hidden
              type="file"
              multiple
            />
          </div>
        )}
      </Modal>
      <Modal
        open={showViewExamModal}
        maskClosable={false}
        title="Add Grade"
        onCancel={() => {
          setShowViewExamModal(false);
        }}
        style={{ width: "80%" }}
        footer={[]}
      >
        {showViewExamModal && (
          <div className="w-100 d-flex flex-column">
            <hr className="m-0" />
            <label className="mt-2">Give a grade </label>
            <Select
              value={newActivity.grade}
              onChange={(value) => {
                setNewActivity({ ...newActivity, grade: value });
              }}
            >
              <Select.Option value="A">A</Select.Option>
              <Select.Option value="B">B</Select.Option>
              <Select.Option value="C">C</Select.Option>
              <Select.Option value="D">D</Select.Option>
              <Select.Option value="E">E</Select.Option>
              <Select.Option value="F">F</Select.Option>
            </Select>

            <Button
              onClick={(e) => handleExamSubmit(e, "exam")}
              type="primary"
              className="mx-auto mt-2"
              style={{ width: "40%" }}
            >
              Finish
            </Button>
            <input
              id="attachFile"
              onChange={handleFileChange}
              hidden
              type="file"
              multiple
            />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MyActivity;
