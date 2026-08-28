import React from 'react'

const Loading = ({ size = 'md', fullScreen = false }) => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  }

  const spinner = (
    <div
      className={`${sizeClasses[size]} animate-spin rounded-full border-solid border-primary border-t-transparent`}
    />
  )

  if (fullScreen) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        {spinner}
      </div>
    )
  }

  return spinner
}

export default Loading