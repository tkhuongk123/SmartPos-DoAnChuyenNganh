import { useNavigate } from "react-router-dom";
import "./ThongBaoTrong.css";

function ThongBaoTrong(props) {
  const navigate = useNavigate();

  return (
    <div className="ThongBaoTrong">
      <div>
        <span className="ThongBaoTrong-primary">{props.message}</span>
      </div>
      <div>
        {props.link ? (
          <button
            onClick={() => {
              navigate(`${props.link}`);
            }}
          >
            {props.title}
          </button>
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default ThongBaoTrong;
