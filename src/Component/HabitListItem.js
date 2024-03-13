// to render a single list item inside the habitList.js file

// redux hook
import { useDispatch } from "react-redux";
import { toast } from 'react-toastify';


// action to delete a habit
import { deleteHabit, setShowStatus } from "../Redux/Reducer/habitReducer";

// for render the section
const HabitListItem = (props) => {
  // for calling reducer actions
  const dispatch = useDispatch();

  // getting values of habit from the props
  const { name, completedDays, url } = props.habit;

  // if user clicks on a list item, show that item's weekly status
  const handleClick = () => {
    dispatch(setShowStatus(props.habit));
  };

  // if user clicks on the delete button, delete the habit
  const handleDelete = () => {
    // dispatch the action to delete the habit
    dispatch(deleteHabit(props.habit.id));
    toast.success('Deletion successful!');
  };

  // render the section
  return (
    <div className=" flex flex-row w-ful justify-center items-center gap-3">
        <div className="w-3/4 ">
        <div className="w-full h-12 bg-[#BEADFA] font-semibold my-1 rounded p-2 flex justify-between items-center cursor-pointer hover:bg-[#A084E8] "   onClick={handleClick}>
      {/* showing name of habit and number of days on which the habit is completed in a week */}
      <div>
        <p>{name}</p>
        <small>{completedDays}/7 Days</small>
      </div>

      {/* showing an icon related to the habit */}
      <div className="float-right">
        <img src={url} alt="icon" className="h-8 w-8" />
      </div>
        </div>
    

        
      {/* button to delete the habit */}
      
        </div>
        <div className="flex flex-row w-ful justify-center items-center h-12 bg-red-500 w-1/4 rounded-lg">
        <button
        onClick={handleDelete}
        className="text-white hover:text-black focus:outline-none h-full w-full "
      >
        Delete
      </button>
        </div>


    </div>
   
  );
};

// export the component
export default HabitListItem;
