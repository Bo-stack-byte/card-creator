import React from 'react';
import './local-styles.css'

const RadioGroup = ({ selectedOption, handleOptionChange }) => {
    /*
    const [selectedOption, setSelectedOption] = useState('');

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };*/

    return (
        <div>
            <span> Template: </span>
            <span className="radio-label"><label>
                    <input
                        type="radio"
                        value="AUTO"
                        checked={selectedOption === 'AUTO'}
                        onChange={handleOptionChange}
                    />
                    AUTO
                </label>
            </span>
            <span className="radio-label"><label>
                <input
                    type="radio"
                    value="EGG"
                    checked={selectedOption === 'EGG'}
                    onChange={handleOptionChange}
                />
                EGG
            </label> </span>
            <span className="radio-label"><label>
                <input
                    type="radio"
                    value="MONSTER"
                    checked={selectedOption === 'MONSTER'}
                    onChange={handleOptionChange}
                />
                MONSTER
            </label> </span>
            <span className="radio-label"><label>
                <input
                    type="radio"
                    value="MEGA"
                    checked={selectedOption === 'MEGA'}
                    onChange={handleOptionChange}
                />
                MEGA
            </label> </span>
            <span className="radio-label"><label>
                <input
                    type="radio"
                    value="OPTION"
                    checked={selectedOption === 'OPTION'}
                    onChange={handleOptionChange}
                />
                OPTION
            </label> </span>
            <span className="radio-label"><label>
                <input
                    type="radio"
                    value="TAMER"
                    checked={selectedOption === 'TAMER'}
                    onChange={handleOptionChange}
                />
                TAMER
            </label> </span>


        </div>
    );
//             <span>Selected option: {selectedOption}</span>
};

export default RadioGroup;
