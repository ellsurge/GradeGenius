import { BookOutlined } from "@ant-design/icons";
import { FaPencilAlt } from "react-icons/fa";
import { Card, Row, Col, message, Typography } from "antd";
import { useSelector } from "react-redux";
import { RadarChart } from "@toast-ui/react-chart";
import { useEffect, useState } from "react";
import { formatText } from "../../_services";
import Markdown from "react-markdown";
import "./style.css";
import API_URL from "../../apiUrl";
const Insight = () => {
  const apiUrl = API_URL;
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const allCourses = useSelector((state) => state.myReducer.courses);
  const { counter } = useSelector((state) => state.myReducer.insight);
  const [aiSatus, setAiAStatus] = useState([false, ""]);
  const [aiSatus2, setAiAStatus2] = useState([false, ""]);
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

  const formattedGrades = studentActivities.map((grade) => {
    return {
      course: grade.course.title,
      lesson: grade.lesson.title,
      grade: grade.grade,
      createdAt: grade.createdAt,
    };
  });


  const getAi = async (prompt, data, setter, val) => {
    if (val[1] === "") { 
    const body = {
      prompt: prompt + JSON.stringify(data),
    };
    // console.log(body);
    setter([true, "loading"]);

    fetch(`${apiUrl}/ai`, {
      method: "post",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((res) => {
        setter([false, res.result]);
      })
      .catch((err) => {
        console.log("Error fetrching ai", err);
        message.error("Error fetching ai data");
      });
  }
  };
  // console.log(studentActivities);
  // const result = '## Overall Assessment\n\nYour grades indicate a mix of strengths and areas for improvement.\n\n### Strengths\n\n- Strong foundation in "rizz" (Grade: A)\n- Progress in "skibidy" (Grade: C in two lessons, despite initial D)\n\n### Areas for Improvement\n\n- Foundation in "skibidy" requires further development\n- D grade in one "skibidy" lesson indicates a need to strengthen understanding\n\n### Recommendations\n\n- Focus on developing "rizz" skills\n- Revise "skibidy" lesson with D grade\n- Seek support or practice in "skibidy" to improve comprehension\n- Set specific improvement goals for "skibidy" and track progress\n\n### Additional Tips\n\n- Attend class regularly and engage in discussions\n- Review notes and textbooks frequently\n- Seek clarification from instructor or classmates as needed\n- Utilize study aids (flashcards, concept maps, practice tests)\n- Stay motivated and maintain focus on your goals';
  // const result2 = '## Study Materials\n\n- [The Art of Charm Podcast](https://www.artofcharm.com/podcasts/)\n- [Charisma on Command YouTube Channel](https://www.youtube.com/channel/UC-D4r_z33_yl5d3jshiStkw)\n- [Mark Manson\'s blog](https://markmanson.net/)\n- ["How to Talk to Anyone: 92 Little Tricks for Big Success in Relationships" by Leil Lowndes](https://www.amazon.com/How-Talk-Anyone-Little-Relationships/dp/0316035564)\n\n## Quiz Questions\n\n**Multiple Choice**\n\n1. Which of the following is NOT a key component of charisma?\n    (a) Confidence\n    (b) Authenticity\n    (c) Cynicism\n    (d) Empathy\n\n2. What is the best way to build rapport with someone?\n    (a) Mirroring their body language\n    (b) Asking them personal questions\n    (c) Interrupting them often\n    (d) Correcting their grammar\n\n**True/False**\n\n1. Eye contact is an important sign of confidence. (True/False)\n2. It is okay to interrupt someone if you have something important to say. (True/False)\n3. Active listening involves asking clarifying questions and summarizing what the other person has said. (True/False)\n\n**Short Answer**\n\n1. Describe three ways to make a good first impression.\n2. Explain how you can use humor to connect with others.\n3. Discuss the importance of body language in communication.';

  // console.log(result);
  useEffect(() => {
    if (formattedGrades.length >0) {
      getAi(
        `Please provide me with a detailed analysis of your grades, well-formatted in Markdown. Include insights into your overall performance, trends, strengths, weaknesses, and any other relevant observations. Ensure that the Markdown formatting is consistent and follows the provided guidelines.

Guidelines:

Clarify Expectations: Your analysis should cover various aspects of your grades, such as overall performance, trends over time, strengths, weaknesses, and any notable observations.
Specify Content: Provide insights into specific areas where you excel and areas that need improvement. Consider factors like subject-wise performance, consistency, attendance, study habits, etc.
Consistent Formatting: Use Markdown to format your analysis consistently. Include headers, lists, tables, or any other Markdown elements as necessary to organize your content effectively.
Standardized Data: If providing specific grade data, ensure it follows a consistent format. For example, use a standardized grading scale or provide clear explanations for any deviations.
Sample Inputs: If available, provide examples of the type of grade data expected and the corresponding analysis. This will help ensure that the analysis meets the desired standards.`,
        formattedGrades,
        setAiAStatus,
        aiSatus,
      );
      getAi(
        `Please recommend study materials and quiz questions for this student, formatted in Markdown. Your recommendations should meet the following criteria:

Relevance: Ensure that the recommended study materials and quiz questions are relevant to the student's learning objectives and current level of proficiency.
Quality: Utilize reputable and standardized sources for study materials and quiz questions to ensure consistency and reliability.
Personalization: Tailor your recommendations to the student's individual learning needs, preferences, and proficiency level. Consider factors such as preferred learning styles, areas of improvement, and interests.
Formatting: Format your recommendations in Markdown to ensure clarity and readability. Use appropriate Markdown elements such as headers, lists, links, and code blocks as needed.`,
        formattedGrades,
        setAiAStatus2,
        aiSatus2,
      );
    }
  }, []);
  return (
    <div className="w-100 " style={{ height: "100%" }}>
      <h5 className="text-center">AI insight</h5>

      <div className="w-100">
        <Row className="w-100" gutter={2}>
          <Col span={12}>
            <div className="markdown-container">
              <Typography>

              <Markdown className="markdown-content">{aiSatus[1]}</Markdown>
              </Typography>
            </div>
          </Col>
          <Col span={12}>
            <div className="markdown-container">
              {/* <Typography> */}

              <Markdown className="markdown-content">{aiSatus2[1]}</Markdown>
              {/* </Typography> */}

            </div>
          </Col>
        </Row>
      </div>
    </div>
  );
};

export default Insight;
