import React, {  useState  } from 'react';

const SaveState = ({ jsonText, fontSize }) => {
    const [referenceId, setReferenceId] = useState(''); // For storing the returned reference ID
    const here = new URL(window.location.href);
    const baseUrl = here.origin + here.pathname;
    let url = baseUrl + "?ref=";

    const handleSave = async () => {
        const cardState = {
            jsonText,
            fontSize
        };
        try {
            let document = { cardState: cardState, referenceId: referenceId };
            const response = await fetch('/api/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(document)
            });
            const result = await response.json();
            let ref = result.referenceId;
            setReferenceId(ref); // Store the returned reference ID
            let shareUrl = url + ref;
            navigator && navigator.clipboard && navigator.clipboard.writeText(shareUrl);
            console.log('Reference ID:', result.referenceId);
        } catch (err) {
            console.error('Error saving artwork:', err);
        }
    };
    let ref = referenceId;
    return (
        <div>
            <button onClick={handleSave}>Save (w/o art for the moment)</button>
            <br/>
            {ref && (<a href={url + ref}>{url + ref}</a>)}
        </div>
    );
};

export default SaveState;
