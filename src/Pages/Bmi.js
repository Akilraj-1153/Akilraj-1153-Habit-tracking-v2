import React, { useState } from 'react';

const Bmi = () => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [bmi, setBmi] = useState(null);

  const calculateBmi = () => {
    if (height && weight) {
      const heightMeters = height / 100;
      const bmiResult = weight / (heightMeters * heightMeters);
      setBmi(bmiResult.toFixed(2));
    }
  };

  const getFoodSuggestion = () => {
    if (bmi) {
      if (bmi < 18.5) {
        return "You're underweight. Try eating more proteins and healthy fats such as nuts, avocados, seeds, whole milk, cheese, yogurt, and fatty fish like salmon and mackerel.";
      } else if (bmi >= 18.5 && bmi < 24.9) {
        return "You're within a healthy weight range. Maintain a balanced diet with plenty of fruits, vegetables, whole grains, lean proteins like chicken breast, turkey, tofu, beans, lentils, and nuts.";
      } else if (bmi >= 25 && bmi < 29.9) {
        return "You're overweight. Focus on portion control, eat more fiber-rich foods like fruits, vegetables, whole grains, and legumes, lean proteins, and healthy fats. Limit processed foods, sugary snacks, and beverages.";
      } else {
        return "You're obese. Consider consulting with a healthcare professional to create a personalized diet and exercise plan. Focus on whole foods like fruits, vegetables, whole grains, lean proteins, and healthy fats. Limit processed foods, sugary snacks, and beverages.";
      }
    }
    return '';
  };

  return (
    <div className='flex justify-center items-center h-screen bg-gray-100'>
      <div className='h-[80vh] w-[90%] bg-Bmi bg-cover bg-no-repeat bg-white rounded-xl shadow-md p-8'>
        <h2 className='text-white text-3xl font-semibold mb-6 text-center'>BMI Calculator</h2>
        <div className='flex flex-row gap-10'>
            <div className='w-3/4'>
            <div className='mb-4'>
            <label className='block text-white mb-2'>Height (cm):</label>
            <input
                type='number'
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className='w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500'
            />
            </div>
            <div className='mb-4'>
            <label className='block text-white mb-2'>Weight (kg):</label>
            <input
                type='number'
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className='w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500'
            />
            </div>
            <button
            onClick={calculateBmi}
            className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700'
            >
            Calculate BMI
            </button>
            {bmi && (
            <div className='mt-4 text-white'>
                <p className='text-lg font-semibold'>Your BMI: {bmi}</p>
                <p className='text-white'>{getFoodSuggestion()}</p>
            </div>
            )}
            </div>

            <div className='w-1/4'>
        <div className='mt-8  text-white'>
          <h3 className='text-xl font-semibold mb-2 align-center flex justify-center items-center'>BMI Categories:</h3>
          <table className='w-full border border-gray-900'>
            <thead>
              <tr className='bg-gray-500'>
                <th className='py-2 px-4 border'>BMI Range</th>
                <th className='py-2 px-4 border'>Category</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className='py-2 px-4 border'>Less than 18.5</td>
                <td className='py-2 px-4 border'>Underweight</td>
              </tr>
              <tr>
                <td className='py-2 px-4 border'>18.5 - 24.9</td>
                <td className='py-2 px-4 border'>Normal weight</td>
              </tr>
              <tr>
                <td className='py-2 px-4 border'>25 - 29.9</td>
                <td className='py-2 px-4 border'>Overweight</td>
              </tr>
              <tr>
                <td className='py-2 px-4 border'>30 or greater</td>
                <td className='py-2 px-4 border'>Obese</td>
              </tr>
            </tbody>
          </table>
        </div>
            </div>
        </div>
        

        
      </div>
    </div>
  );
};

export default Bmi;
