import ToggleButtonGroup from 'react-bootstrap/ToggleButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';

import './Filter.scss';

export default function RenderFilter({
    title,
    currentList,
    updateCurrentList,
    fullList,
    readableNameDict
}) {
    return (
        <div className="filter">
            <div className="filter__label">{title}</div>
            <ToggleButtonGroup
                type="checkbox"
                value={currentList}
                onChange={updateCurrentList}
                className="filter__group"
            >
                {fullList.map((buttonName, index) => {
                    return (
                        <ToggleButton
                            key={index}
                            id={`filter-button-${index}`}
                            value={buttonName}
                            className="filter__item filter__item-primary"
                        >
                            {readableNameDict ? readableNameDict[buttonName] : buttonName}
                        </ToggleButton>
                    );
                })}
            </ToggleButtonGroup>
        </div>
    );
}
