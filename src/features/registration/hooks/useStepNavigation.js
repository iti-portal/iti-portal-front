import { useState, useCallback, useEffect } from 'react';
import { getStepsForRole, getNextStepForRole, getPreviousStepForRole } from '../constants/registrationSteps';

/**
 * Step navigation hook
 * Manages navigation between registration steps
 */
export const useStepNavigation = (initialStep = 1, role = '') => {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [history, setHistory] = useState([initialStep]);

  /**
   * Get all steps for the current role
   */
  const getSteps = useCallback(() => {
    return getStepsForRole(role);
  }, [role]);

  /**
   * Get current step information
   */
  const getCurrentStepInfo = useCallback(() => {
    const steps = getStepsForRole(role);
    return steps.find(step => step.id === currentStep);
  }, [currentStep, role]);

  /**
   * Navigate to next step
   */
  const nextStep = useCallback(() => {
    const nextStepData = getNextStepForRole(currentStep, role);
    if (nextStepData) {
      setCurrentStep(nextStepData.id);
      setHistory(prev => [...prev, nextStepData.id]);
    }
  }, [currentStep, role]);

  /**
   * Navigate to previous step
   */
  const prevStep = useCallback(() => {
    const prevStepData = getPreviousStepForRole(currentStep, role);
    if (prevStepData) {
      setCurrentStep(prevStepData.id);
      setHistory(prev => prev.slice(0, -1));
    }
  }, [currentStep, role]);

  /**
   * Go to specific step
   */
  const goToStep = useCallback((step) => {
    const steps = getStepsForRole(role);
    const stepExists = steps.find(s => s.id === step);
    if (stepExists) {
      setCurrentStep(step);
      // Update history - remove all steps after the target step
      setHistory(prev => {
        const targetIndex = prev.indexOf(step);
        if (targetIndex !== -1) {
          return prev.slice(0, targetIndex + 1);
        } else {
          return [...prev, step];
        }
      });
    }
  }, [role]);

  /**
   * Check if can go to next step
   */
  const canGoNext = useCallback(() => {
    return getNextStepForRole(currentStep, role) !== null;
  }, [currentStep, role]);

  /**
   * Check if can go to previous step
   */
  const canGoPrevious = useCallback(() => {
    return getPreviousStepForRole(currentStep, role) !== null;
  }, [currentStep, role]);

  /**
   * Check if on first step
   */
  const isFirstStep = useCallback(() => {
    const steps = getStepsForRole(role);
    return currentStep === steps[0]?.id;
  }, [currentStep, role]);

  /**
   * Check if on last step
   */
  const isLastStep = useCallback(() => {
    const steps = getStepsForRole(role);
    return currentStep === steps[steps.length - 1]?.id;
  }, [currentStep, role]);

  /**
   * Get progress percentage
   */
  const getProgress = useCallback(() => {
    const steps = getStepsForRole(role);
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    return ((currentIndex + 1) / steps.length) * 100;
  }, [currentStep, role]);

  /**
   * Get step number (1-based index)
   */
  const getStepNumber = useCallback(() => {
    const steps = getStepsForRole(role);
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    return currentIndex + 1;
  }, [currentStep, role]);

  /**
   * Reset navigation to initial state
   */
  const resetNavigation = useCallback(() => {
    setCurrentStep(initialStep);
    setHistory([initialStep]);
  }, [initialStep]);

  /**
   * Check if a step has been visited
   */
  const hasVisitedStep = useCallback((step) => {
    return history.includes(step);
  }, [history]);

  // Reset when role changes
  useEffect(() => {
    if (role) {
      const steps = getStepsForRole(role);
      if (steps.length > 0 && !steps.find(step => step.id === currentStep)) {
        // Current step is not valid for this role, reset to first step
        setCurrentStep(steps[0].id);
        setHistory([steps[0].id]);
      }
    }
  }, [role, currentStep]);
  return {
    // State
    currentStep,
    history,
    
    // Actions
    nextStep,
    prevStep,
    goToStep,
    resetNavigation,
    
    // Computed
    getSteps,
    getCurrentStepInfo,
    canGoNext: canGoNext(),
    canGoPrevious: canGoPrevious(),
    isFirstStep: isFirstStep(),
    isLastStep: isLastStep(),
    progress: getProgress(),
    stepNumber: getStepNumber(),
    totalSteps: getStepsForRole(role).length,
    hasVisitedStep
  };
};

export default useStepNavigation;
