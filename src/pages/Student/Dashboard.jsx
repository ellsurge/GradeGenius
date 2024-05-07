import { BookOutlined } from "@ant-design/icons";
import { FaPencilAlt } from "react-icons/fa";
import { Card, Row, Col, Flex } from "antd";
import { useSelector } from "react-redux";
import React, { useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  Bar,
  BarChart,
  PieChart,
  Pie,
  Cell,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  RadarChart,
} from "recharts";

const StudentDashboard = () => {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const allCourses = useSelector((state) => state.myReducer.courses);

  const courseRegs = useSelector((state) => state.myReducer.courseRegs);
  const myCourseRegs = courseRegs.filter((cr) => cr.user === currentUser._id);

  const myCourses = allCourses.filter(
    (course) => course.department === currentUser.department
  );
  const myFinalCourses = myCourses.filter((course) => {
    let isInMyCourseRegs = myCourseRegs.filter(
      (cr) => cr.course === course._id
    );
    return isInMyCourseRegs.length > 0;
  });

  const allLessons = useSelector((state) => state.myReducer.lessons);
  const myLessons = allLessons.filter((lesson) => {
    const isOfMyCourse =
      myFinalCourses.filter((course) => course._id === lesson.course).length >
      0;
    return isOfMyCourse;
  });

  const activities = useSelector((state) => state.myReducer.studentActivities);
  const studentActivities = activities.filter(
    (activity) => activity.student._id === currentUser._id
  );

  function convertGradeToNumber(grade) {
    switch (grade) {
      case "A":
        return 5;
      case "B":
        return 4;
      case "C":
        return 3;
      case "D":
        return 2;
      case "E":
        return 1;
      case "F":
        return 0;
      default:
        return null;
    }
  }

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  function groupByTimeAndCourse(data) {
    const groupedData = [];

    // Iterate through each object in the data array
    data.forEach((item) => {
      const itemDate = item.createdAt;

      // Find the existing entry for this timestamp
      let existingEntry = groupedData.find((entry) => entry.time === itemDate);

      // If no entry exists, create a new one
      if (!existingEntry) {
        existingEntry = {
          time: itemDate,
          ...Object.fromEntries(data.map((item) => [item.course.title, null])),
        };
        groupedData.push(existingEntry);
      }

      // Update the current courses
      existingEntry[item.course.title] = convertGradeToNumber(item.grade);

      // Replace null values with the previous grades
      Object.entries(existingEntry).forEach(([course, grade]) => {
        if (grade === null) {
          const prevEntry = groupedData
            .slice()
            .reverse()
            .find((entry) => entry.time < itemDate);
          existingEntry[course] = prevEntry ? prevEntry[course] : null;
        }
      });
    });

    return groupedData;
  }

  function calculateAverageGrade(data) {
    // Create an object to store the sum of grades and count of occurrences for each course
    const courseGrades = {};

    // Iterate over the data to calculate the sum and count of grades for each course
    data.forEach((entry) => {
      const { course, grade } = entry;
      const numericGrade = convertGradeToNumber(grade);

      if (course && numericGrade !== null) {
        if (!courseGrades[course.title]) {
          courseGrades[course.title] = { sum: 0, count: 0 };
        }
        courseGrades[course.title].sum += numericGrade;
        courseGrades[course.title].count++;
      }
    });

    // Calculate the average grade for each course
    const averages = Object.keys(courseGrades).map((course) => ({
      course: course,
      value:
        courseGrades[course].count > 0
          ? courseGrades[course].sum / courseGrades[course].count
          : null,
    }));

    return averages;
  }

  const lineData = groupByTimeAndCourse(studentActivities);
  const averageData = calculateAverageGrade(studentActivities);
  // console.log(averageData);
  const datatest = [
    {
      time: "2024-04-16T12:12:25.982Z",
      rizz: 5,
      skibidy: null,
    },
    {
      time: "2024-04-16T12:28:33.377Z",
      rizz: 5,
      skibidy: 3,
    },
    {
      time: "2024-04-16T12:39:50.012Z",
      rizz: 5,
      skibidy: 2,
    },
    {
      time: "2024-04-16T13:40:00.789Z",
      rizz: 3,
      skibidy: 2,
    },
    {
      time: "2024-04-25T10:02:39.772Z",
      rizz: 3,
      skibidy: 2,
    },
  ];
  const keys = lineData.length > 0 ? Object.keys(lineData[0]) : [];

  // Remove the `time` key from the keys array
  const dataKeys = keys.filter((key) => key !== "time");

  // Generate Line components dynamically
  const colors = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#00487B",
    "#00665E",
    "#996C00",
    "#995E00",
    "#4C2C21",
    "#4C4F2C",
    "#7B4C00",
    "#7B2C00",
    "#00404F",
    "#005E4C",
    "#7B5900",
    "#7B4C00",
  ];

  const lineComponents = dataKeys.map((key, index) => (
    <Area
      key={index}
      type="monotone"
      dataKey={key}
      stackId="1"
      stroke={colors[index]} // Assuming first key is 'rizz' and second key is 'skibidy'
      fill={colors[index]} // Assuming first key is 'rizz' and second key is 'skibidy'
      activeDot={{ r: 8 }}
    />
  ));

  const barComponents = dataKeys.map((key, index) => (
    <Bar
      key={index}
      type="monotone"
      dataKey={key}
      stackId="a"
      fill={colors[index]} // Assuming first key is 'rizz' and second key is 'skibidy'
    />
  ));
  const boxStyle = {
    width: "100%",
    height: "50vh",
    borderRadius: 6,
    paddingTop: "2rem",
    paddingBottom: "1rem",
    paddingLeft: "1rem",
    paddingRight: "1rem",
    // border: "1px solid #40a9ff",
  };

  return (
    <div className="w-100 bg-light" style={{ height: "100%" }}>
      <div className="w-100">
        <Row className="w-100" gutter={5}>
          <Col span={12}>
            <Card className="d-flex flex-column justify-content-center align-items-center">
              <div className="text-center">
                <BookOutlined className="fs-3" />
              </div>
              <h5 className="text-center">My Courses</h5>
              <h3 className="text-center">{myFinalCourses.length}</h3>
            </Card>
          </Col>
          <Col span={12}>
            <Card className="d-flex flex-column justify-content-center align-items-center">
              <div className="text-center">
                <FaPencilAlt className="fs-3" />
              </div>
              <h5 className="text-center">My Lessons</h5>
              <h3 className="text-center">{myLessons.length}</h3>
            </Card>
          </Col>
        </Row>
        <Flex
          className="bg-light"
           style={boxStyle}
          justify={"space-between"}
          align={"flex-start"}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              width={500}
              height={400}
              data={lineData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              {lineComponents}
            </AreaChart>
          </ResponsiveContainer>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              width={500}
              height={400}
              data={lineData}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Legend />
              {barComponents}
            </BarChart>
          </ResponsiveContainer>
        </Flex>
        <Flex
          className="bg-light"
          style={boxStyle}
          justify={"space-between"}
          align={"flex-start"}
        >
          <ResponsiveContainer width="100%" height="100%">
            <PieChart width={400} height={400}>
              <Pie
                data={averageData}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={renderCustomizedLabel}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {averageData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={averageData}>
              <PolarGrid />

              <PolarAngleAxis dataKey="course" />
              <PolarRadiusAxis />
              <Radar
                name="stats"
                dataKey="value"
                stroke="#8884d8"
                fill="#8884d8"
                fillOpacity={0.6}
              />
            </RadarChart>
          </ResponsiveContainer>
        </Flex>
      </div>
    </div>
  );
};

export default StudentDashboard;
