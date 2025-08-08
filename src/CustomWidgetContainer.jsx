import React, { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import Zone from './Zone';
import { Provider } from '@clayui/core';
import '@clayui/css/lib/css/atlas.css';

function CustomWidgetContainer({ availableWidgets, numberOfWidgets }) {

    const initialAssignments = {};
    for (let i = 1; i <= numberOfWidgets; i++) {
        initialAssignments[`zone-${i}`] = null;
    }

    const [widgetAssignments, setWidgetAssignments] = useState(initialAssignments);

    const moveWidget = (fromZoneId, toZoneId) => {
        setWidgetAssignments((prevAssignments) => {
            const updatedAssignments = { ...prevAssignments };

            const sourceWidgetId = updatedAssignments[fromZoneId];
            const destinationWidgetId = updatedAssignments[toZoneId];

            updatedAssignments[fromZoneId] = destinationWidgetId;
            updatedAssignments[toZoneId] = sourceWidgetId;

            return updatedAssignments;
        });
    };

    const handleWidgetSelection = (zoneId, widgetId) => {
        setWidgetAssignments((prevAssignments) => {
            const updatedAssignments = { ...prevAssignments };

            for (let zone in updatedAssignments) {
                if (updatedAssignments[zone] === widgetId) {
                    updatedAssignments[zone] = null;
                }
            }

            updatedAssignments[zoneId] = widgetId;

            return updatedAssignments;
        });
    };

    const handleRemoveWidget = (widgetId) => {
        setWidgetAssignments((prevAssignments) => {
            const updatedAssignments = { ...prevAssignments };

            for (let zone in updatedAssignments) {
                if (updatedAssignments[zone] === widgetId) {
                    updatedAssignments[zone] = null;
                }
            }

            return updatedAssignments;
        });
    };

    return (
        <Provider spritemap={window.Liferay.Icons.spritemap}>
            <DndProvider backend={HTML5Backend}>
                <div className="container">
                    <div className="row">
                        {Object.keys(widgetAssignments).map((zoneId) => (
                            <div key={zoneId} className="col-sm-6 mb-4">
                                <Zone
                                    zoneId={zoneId}
                                    widgetId={widgetAssignments[zoneId]}
                                    availableWidgets={availableWidgets}
                                    handleWidgetSelection={handleWidgetSelection}
                                    handleRemoveWidget={handleRemoveWidget}
                                    moveWidget={moveWidget}
                                    widgetAssignments={widgetAssignments}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </DndProvider>
        </Provider>
    );
}

export default CustomWidgetContainer;
