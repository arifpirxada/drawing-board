function UploadLoading() {
    return (
        <div className="upload-overlay">
            <div className="upload-card">
                <div className="upload-card__corner upload-card__corner--tl" />
                <div className="upload-card__corner upload-card__corner--br" />
                <div className="upload-spinner" aria-hidden="true" />
                <p className="upload-card__text">
                    <span className="upload-card__dot" />
                    Uploading image…
                </p>
                <div className="upload-bar-track">
                    <div className="upload-bar" />
                </div>
            </div>
        </div>
    );
}

export default UploadLoading;