import clsx from 'clsx'
import React from 'react'

export default function Stepper({
  activeStep = 0,
  steps = [],
}: {
  activeStep: number
  steps: string[]
}) {
  return (
    <div className='mx-auto w-full max-w-4xl'>
      <div className='flex items-center'>
        {steps.map((_, index) => {
          const isCompleted = index < activeStep
          const isActive = index === activeStep

          return (
            <React.Fragment key={index}>
              <div
                className={clsx(
                  'flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors duration-200',
                  {
                    'border-[#7A58E7] bg-white text-[#7A58E7]': isActive,
                    'border-[#7A58E7]  text-white': isCompleted,
                    'border-gray-300 bg-white text-gray-500':
                      !isActive && !isCompleted,
                  }
                )}
              >
                {isCompleted ? (
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='21'
                    height='20'
                    viewBox='0 0 21 20'
                    fill='none'
                  >
                    <path
                      d='M10.0371 0.78418C10.2191 0.494539 10.5202 0.435539 10.7432 0.569336L10.7588 0.579102L10.7764 0.587891C10.8462 0.622811 10.8712 0.644685 10.8838 0.657227C10.8901 0.663522 10.8988 0.672771 10.9102 0.689453L10.9531 0.764648L13.5527 5.96484L13.6699 6.19922L13.9307 6.23633L19.6309 7.03613L19.665 7.04102H19.7002C19.7424 7.0411 19.8312 7.06984 19.917 7.19141C20.0024 7.31238 20.0283 7.4504 20.0098 7.54297L20 7.5918V7.64062C20 7.65852 19.9957 7.67286 19.9912 7.68066C19.9893 7.68407 19.9869 7.68596 19.9854 7.6875C19.9839 7.68889 19.9812 7.69099 19.9766 7.69336L19.9062 7.72852L19.8506 7.7832L15.751 11.7832L15.5615 11.9678L15.6074 12.2275L16.6064 17.9219V17.9229C16.6581 18.2329 16.4646 18.4772 16.2334 18.541H16.0996C16.0483 18.541 16.0066 18.5413 15.9678 18.54C15.9395 18.5391 15.9175 18.5359 15.9004 18.5342L15.834 18.499L10.7344 15.7988L10.5 15.6748L10.2656 15.7988L5.16602 18.499L5.1543 18.5049L5.14258 18.5127C4.92057 18.6457 4.62253 18.5871 4.44043 18.3008C4.40919 18.2298 4.40216 18.1496 4.40137 17.9756L5.39258 12.3271L5.43848 12.0674L5.24902 11.8828L1.14941 7.88281C0.949041 7.67844 0.950071 7.39761 1.15332 7.19434L1.21094 7.13672L1.24707 7.06445C1.24933 7.05994 1.24958 7.06097 1.24707 7.06348C1.24474 7.06574 1.24462 7.06568 1.24902 7.06348C1.26037 7.05786 1.30333 7.04102 1.40039 7.04102H1.43457L1.46973 7.03613L7.16992 6.23633L7.43457 6.19922L7.55078 5.95801L10.0371 0.78418Z'
                      fill='#7A58E7'
                      stroke='#7A58E7'
                    />
                  </svg>
                ) : (
                  <span className='font-medium'>{index + 1}</span>
                )}
              </div>

              {index < steps.length - 1 && (
                <div
                  className={clsx(
                    ' h-0.5 flex-1 transition-colors duration-200',
                    {
                      'bg-[#7A58E7]': index < activeStep,
                      'bg-gray-300': index >= activeStep,
                    }
                  )}
                />
              )}
            </React.Fragment>
          )
        })}
      </div>

      <div className='mt-2 flex items-start justify-between'>
        {steps.map((step, index) => {
          const isCompleted = index < activeStep
          const isActive = index === activeStep

          return (
            <div
              key={index}
              className='flex w-10 flex-col items-center text-center'
            >
              <span
                className={clsx('text-sm font-medium', {
                  'text-[#7A58E7]': isActive || isCompleted,
                  'text-gray-500': !isActive && !isCompleted,
                })}
              >
                {step}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
// <Stepper activeStep={2} steps={steps} />
// const steps = ['Vehicle', 'Services', 'Info', 'Appointment']
