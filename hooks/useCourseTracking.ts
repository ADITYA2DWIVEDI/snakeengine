import { useState, useEffect, useCallback } from 'react';
import { Course } from '../types';
import { courseData } from '../courseData';

const getStoredCourses = (key: string): number[] => {
    try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error(`Error reading ${key} from localStorage`, error);
        return [];
    }
};

export const useCourseTracking = () => {
    const [bookmarkedIds, setBookmarkedIds] = useState<number[]>(() => getStoredCourses('bookmarkedCourseIds'));
    const [completedIds, setCompletedIds] = useState<number[]>(() => getStoredCourses('completedCourseIds'));

    const [bookmarkedCourses, setBookmarkedCourses] = useState<Course[]>([]);
    const [completedCourses, setCompletedCourses] = useState<Course[]>([]);

    useEffect(() => {
        try {
            localStorage.setItem('bookmarkedCourseIds', JSON.stringify(bookmarkedIds));
            const filtered = courseData.courses.filter(c => bookmarkedIds.includes(c.id));
            setBookmarkedCourses(filtered);
        } catch (error) {
            console.error('Error saving bookmarked courses to localStorage', error);
        }
    }, [bookmarkedIds]);

    useEffect(() => {
        try {
            localStorage.setItem('completedCourseIds', JSON.stringify(completedIds));
            const filtered = courseData.courses.filter(c => completedIds.includes(c.id));
            setCompletedCourses(filtered);
        } catch (error) {
            console.error('Error saving completed courses to localStorage', error);
        }
    }, [completedIds]);

    const toggleBookmark = useCallback((courseId: number) => {
        setBookmarkedIds(prev =>
            prev.includes(courseId) ? prev.filter(id => id !== courseId) : [...prev, courseId]
        );
    }, []);

    const toggleComplete = useCallback((courseId: number) => {
        setCompletedIds(prev => {
            const isCompleted = prev.includes(courseId);
            if (isCompleted) {
                return prev.filter(id => id !== courseId);
            } else {
                // Also remove from bookmarked if marking as complete
                setBookmarkedIds(b => b.filter(id => id !== courseId));
                return [...prev, courseId];
            }
        });
    }, []);
    
    const markAsCompleteFromBookmark = useCallback((courseId: number) => {
        setBookmarkedIds(prev => prev.filter(id => id !== courseId));
        setCompletedIds(prev => prev.includes(courseId) ? prev : [...prev, courseId]);
    }, []);
    
    const clearAllTrackedCourses = () => {
        try {
            localStorage.removeItem('bookmarkedCourseIds');
            localStorage.removeItem('completedCourseIds');
            setBookmarkedIds([]);
            setCompletedIds([]);
        } catch (error) {
            console.error('Error clearing course tracking data from localStorage', error);
        }
    };

    return {
        bookmarkedIds,
        completedIds,
        bookmarkedCourses,
        completedCourses,
        toggleBookmark,
        toggleComplete,
        markAsCompleteFromBookmark,
        clearAllTrackedCourses,
    };
};