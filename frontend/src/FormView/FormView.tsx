import SubmitFormButton from '../BackendCommunication/SubmitFormButton.tsx'
import FormSection  from '../FormCreator/FormSection.tsx'

function FormRender() {
    return (
        <div className="p-6">
            <FormSection/>
            <SubmitFormButton />
        </div>
    );
}

export default FormRender ;
