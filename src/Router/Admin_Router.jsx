import Achievement from "../component/pages/academic/Achievement";
import Event from "../component/pages/academic/Event";
import QuestionBankAdmin from "../component/pages/academic/Question__Bank";
import BlogManagement from "../component/pages/blogs/Blog";
import Blogcategory from "../component/pages/blogs/Blog_category";
import Dashboard from "../component/pages/Dashboard";
import FAQPage from "../component/pages/FAQs";
import GalleryCategory from "../component/pages/gallery/Gallery_category";
import Gallery from "../component/pages/gallery/Gallery_Content";

import Notice_Category from "../component/pages/Notice/Notice_Category";
import NoticeManagement from "../component/pages/Notice/Notice_management";

import Review from "../component/pages/Review";
import Team from "../component/pages/Team/Team";
import TeamCategory from "../component/pages/Team/Team_category";
import Vacancy_Category from "../component/pages/vacancy/Vacancy_category";
import VacancyManagement from "../component/pages/vacancy/Vacancy_Management";

export const adminRoutes = [
  {
    index: true, // Default route for /admin
    element: <Dashboard />,
  },
  {
    path: "dashboard",
    element: <Dashboard />,
  },
  {
    path: "review",
    element: <Review />,
  },
  {
    path: "faqs",
    element: <FAQPage />,
  },
  {
    path: "team",
    element: <Team />,
  },
  {
    path: "event",
    element: <Event />,
  },
  {
    path: "question-bank",
    element: <QuestionBankAdmin />,
  },
  {
    path: "achievement",
    element: <Achievement />,
  },
  {
    path: "gallery",
    element: <Gallery />,
  },
  {
    path: "gallery/category",
    element: <GalleryCategory />,
  },
  {
    path: "notice",
    element: <NoticeManagement />,
  },
  {
    path: "notice/category",
    element: <Notice_Category />,
  },
  {
    path: "vacancy",
    element: <VacancyManagement />,
  },
  {
    path: "vacancy/category",
    element: <Vacancy_Category />,
  },
  {
    path: "blog",
    element: <BlogManagement />,
  },
  {
    path: "blog/category",
    element: <Blogcategory />,
  },
  {
    path: "team/category",
    element: <TeamCategory />,
  },
];
