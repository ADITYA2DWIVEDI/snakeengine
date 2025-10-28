import React from 'react';
import { useCourseTracking } from '../hooks/useCourseTracking';
import { Course } from '../types';
import { BookOpenIcon } from '../constants';

const CheckCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>;
const XCircleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>;

const LearningCourseCard: React.FC<{ 
    course: Course;
    isBookmarked?: boolean;
    onMarkComplete: (id: number) => void;
    onRemove: (id: number) => void;
}> = ({ course, isBookmarked = false, onMarkComplete, onRemove }) => {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 flex items-center space-x-4 border border-gray-200 dark:border-gray-700">
            <div className="flex-shrink-0 w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <BookOpenIcon className="h-8 w-8 text-purple-500" />
            </div>
            <div className="flex-1">
                <h3 className="font-semibold text-gray-800 dark:text-white">{course.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">{course.tags.join(', ')}</p>
            </div>
            <div className="flex items-center space-x-2">
                {isBookmarked && (
                     <button onClick={() => onMarkComplete(course.id)} title="Mark as Complete" className="p-2 rounded-full hover:bg-green-100 dark:hover:bg-green-500/10">
                        <CheckCircleIcon />
                    </button>
                )}
                <button onClick={() => onRemove(course.id)} title="Remove" className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-500/10">
                    <XCircleIcon />
                </button>
            </div>
        </div>
    );
};


const MyLearningPage: React.FC = () => {
    const { 
        bookmarkedCourses, 
        completedCourses, 
        toggleBookmark, 
        toggleComplete,
        markAsCompleteFromBookmark
    } = useCourseTracking();

    return (
        <div className="min-h-full p-4 md:p-8 bg-gray-100 dark:bg-gray-900">
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white">
                    My <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-cyan-500">Learning</span>
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">Track your bookmarked and completed courses.</p>
            </div>

            <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Bookmarked Section */}
                <div>
                    <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">Bookmarked Courses ({bookmarkedCourses.length})</h2>
                    <div className="bg-white dark:bg-gray-800/50 rounded-2xl shadow-lg p-6 space-y-4 border border-gray-200 dark:border-gray-700 min-h-[200px]">
                        {bookmarkedCourses.length > 0 ? (
                            bookmarkedCourses.map(course => (
                                <LearningCourseCard 
                                    key={course.id} 
                                    course={course}
                                    isBookmarked
                                    onMarkComplete={markAsCompleteFromBookmark}
                                    onRemove={toggleBookmark}
                                />
                            ))
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400 text-center py-8">You haven't bookmarked any courses yet. Go to the Courses page to start!</p>
                        )}
                    </div>
                </div>

                {/* Completed Section */}
                <div>
                    <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-4">Completed Courses ({completedCourses.length})</h2>
                     <div className="bg-white dark:bg-gray-800/50 rounded-2xl shadow-lg p-6 space-y-4 border border-gray-200 dark:border-gray-700 min-h-[200px]">
                        {completedCourses.length > 0 ? (
                            completedCourses.map(course => (
                                <LearningCourseCard 
                                    key={course.id} 
                                    course={course}
                                    onMarkComplete={() => {}}
                                    onRemove={toggleComplete}
                                />
                            ))
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400 text-center py-8">You haven't completed any courses yet.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyLearningPage;