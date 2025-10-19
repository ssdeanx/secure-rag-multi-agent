import { Workflow, createStep, Step } from '@mastra/core/workflows';
import { z } from 'zod';
import { log } from '../config/logger';

const stepOne = createStep({
  id: 'stepOne',
  description: 'Doubles the input value',
  inputSchema: z.object({
    inputValue: z.number(),
  }),
  outputSchema: z.object({
    doubledValue: z.number(),
  }),
  execute: async ({ inputData }) => {
    const doubledValue = inputData.inputValue * 2;
    return { doubledValue };
  },
});

const stepTwo = createStep({
  id: 'stepTwo',
  description: 'Adds 1 to the input value',
  inputSchema: z.object({
    valueToIncrement: z.number(),
  }),
  outputSchema: z.object({
    incrementedValue: z.number(),
  }),
  execute: async ({ inputData }) => {
    const incrementedValue = inputData.valueToIncrement + 1;
    return { incrementedValue };
  },
});

const stepThree = createStep({
  id: 'stepThree',
  description: 'Squares the input value',
  inputSchema: z.object({
    valueToSquare: z.number(),
  }),
  outputSchema: z.object({
    squaredValue: z.number(),
  }),
  execute: async ({ inputData }) => {
    const squaredValue = inputData.valueToSquare * inputData.valueToSquare;
    return { squaredValue };
  },
});

const stepFour = createStep({
  id: 'stepFour',
  description: 'Gives the square root of the input value',
  inputSchema: z.object({
    valueToRoot: z.number(),
  }),
  outputSchema: z.object({
    rootValue: z.number(),
  }),
  execute: async ({ inputData }) => {
    return { rootValue: Math.sqrt(inputData.valueToRoot) };
  },
});

const stepFive = createStep({
  id: 'stepFive',
  description: 'Triples the input value',
  inputSchema: z.object({
    inputValue: z.number(),
  }),
  outputSchema: z.object({
    tripledValue: z.number(),
  }),
  execute: async ({ inputData }) => {
    const tripledValue = inputData.inputValue * 3;
    return { tripledValue };
  },
});

const stepSix = createStep({
  id: 'stepSix',
  description: 'Logs the input value',
  inputSchema: z.object({
    inputValue: z.number(),
  }),
  outputSchema: z.object({
    rawText: z.string(),
  }),
  execute: async ({ inputData }) => {
    // Ensure we log a string (or structured object) to match logger signature
    log.info(String(inputData.inputValue));
    return { rawText: inputData.inputValue.toString() };
  },
});

export const sequentialWorkflow = new Workflow({
  id: 'sequential-workflow',
  inputSchema: z.object({
    firstValue: z.number(),
  }),
  outputSchema: z.any(),
});

(sequentialWorkflow as any)
  .step(stepOne, {
    variables: {
      inputValue: {
        step: 'trigger',
        path: 'firstValue',
      },
    },
  })
  .then(stepTwo, {
    variables: {
      valueToIncrement: {
        step: stepOne,
        path: 'doubledValue',
      },
    },
  })
  .then(stepThree, {
    variables: {
      valueToSquare: {
        step: stepTwo,
        path: 'incrementedValue',
      },
    },
  })
  .then(stepFour, {
    variables: {
      valueToRoot: {
        step: stepThree,
        path: 'squaredValue',
      },
    },
  })
  .then(stepFive, {
    variables: {
      inputValue: {
        step: stepFour,
        path: 'rootValue',
      },
    },
  });

sequentialWorkflow.commit();

export const parallelWorkflow = new Workflow({
  id: 'parallel-workflow',
  inputSchema: z.object({
    firstValue: z.number(),
  }),
  outputSchema: z.any(),
});


(parallelWorkflow as any)
  .step(stepOne, {
    variables: {
      inputValue: {
        step: 'trigger',
        path: 'firstValue',
      },
    },
  })
  .then(stepSix, {
    variables: {
      inputValue: {
        step: stepOne,
        path: 'doubledValue',
      },
    },
  })
  .step(stepTwo, {
    variables: {
      valueToIncrement: {
        step: 'trigger',
        path: 'firstValue',
      },
    },
  })
  .step(stepThree, {
    variables: {
      valueToSquare: {
        step: 'trigger',
        path: 'firstValue',
      },
    },
  });

export const branchedWorkflow = new Workflow({
  id: 'branched-workflow',
  inputSchema: z.object({
    firstValue: z.number(),
  }),
  outputSchema: z.any(),
});


(branchedWorkflow as any)
  .step(stepOne, {
    variables: {
      inputValue: {
        step: 'trigger',
        path: 'firstValue',
      },
    },
  })
  .then(stepTwo, {
    variables: {
      valueToIncrement: {
        step: stepOne,
        path: 'doubledValue',
      },
    },
  })
  .then(stepFour, {
    variables: {
      valueToRoot: {
        step: stepTwo,
        path: 'incrementedValue',
      },
    },
  })
  .after(stepOne)
  .step(stepThree, {
    variables: {
      valueToSquare: {
        step: stepOne,
        path: 'doubledValue',
      },
    },
  })
  .then(stepFive, {
    variables: {
      inputValue: {
        step: stepThree,
        path: 'squaredValue',
      },
    },
  });
export const cyclicalWorkflow = new Workflow({
  id: 'cyclical-workflow',
  inputSchema: z.object({
    firstValue: z.number(),
  }),
  outputSchema: z.any(),
});

(cyclicalWorkflow as any)
  .step(stepOne, {
    variables: {
      inputValue: {
        step: 'trigger',
        path: 'firstValue',
      },
    },
  })
  .then(stepTwo, {
    variables: {
      valueToIncrement: {
        step: 'trigger',
        path: 'firstValue',
      },
    },
  })
  .after(stepOne)
  .step(stepThree, {
    when: { ref: { step: stepOne, path: 'doubledValue' }, query: { $lte: 6 } },
    variables: {
      valueToSquare: {
        step: stepOne,
        path: 'doubledValue',
      },
    },
  })
  .step(stepOne, {
    when: {
      ref: { step: stepOne, path: 'doubledValue' },
      query: { $lte: 120000 },
    },
    variables: {
      inputValue: {
        step: stepOne,
        path: 'doubledValue',
      },
    },
  });

cyclicalWorkflow.commit();
