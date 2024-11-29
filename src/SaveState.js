import React, {  useState  } from 'react';

const SaveState = ({ jsonText, fontSize }) => {
    const [handle, setHandle] = useState({ referenceId: 0, versionId: 0 } ); // For storing the returned reference ID
    const here = new URL(window.location.href);
    const baseUrl = here.origin + here.pathname;
    let url = baseUrl + "?ref=";

    const handleSave = async () => {
        const cardState = {
            jsonText,
            fontSize
        };
        try {
            let document = { cardState: cardState, referenceId: handle.referenceId };
            const response = await fetch('/api/save', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(document)
            });
            const result = await response.json();
            let ref = result.referenceId;
            let version = result.versionId;
            setHandle( { referenceId: ref, versionId: version } ); // Store the returned reference ID
            let shareUrl = url + ref + "&v=" + version;
            navigator && navigator.clipboard && navigator.clipboard.writeText(shareUrl);
            console.log('Reference ID:', result.referenceId);
            console.log('Version ID:', result.referenceId);
        } catch (err) {
            console.error('Error saving artwork:', err);
        }
    };
    let ref = handle;
    let link = url + ref.referenceId + "&v=" + ref.versionId;
    console.log(35, ref);
    console.log(36, link);
    console.log(37, ref.referenceId ? (<a href={link}>{link}</a>) : "");
    return (
        <div>
            <button onClick={handleSave}>Get Share Link (w/o art for the moment)</button>
            <br/>
            {ref.referenceId ? (<a href={link}>{link}</a>) : ""}
        </div>
    );
};

export default SaveState;
