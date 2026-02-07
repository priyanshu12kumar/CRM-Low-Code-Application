import type {fieldType} from '../GlobalTypes/types.ts' ;
import { FormComponent } from '../GlobalTypes/formType.ts' ;
import { FormBuilderContextType } from '../GlobalTypes/types.ts' ;

function FormComponentsArrayUtility(setSelectedElementsList  : React.Dispatch<React.SetStateAction<fieldType[]>> ,
                                              selectedElementsList : fieldType[]) : FormBuilderContextType {
    // Create (append to end)
    const addElement = (element: fieldType) => {
      setSelectedElementsList((prev) => [...prev, element]);
    };

    // Remove by index (backward-compatible)
    const removeElement = (index: number) => {
      setSelectedElementsList((prev) => prev.filter((_, i) => i !== index));
    };

    // Remove by id (recommended for filtered UIs)
    const removeById = (id: string) => {
      setSelectedElementsList((prev) => prev.filter((f) => f.inputId !== id));
    };

    // Return getter and setter to components
    const getSelectedFieldList = (): [fieldType[], React.Dispatch<React.SetStateAction<fieldType[]>>] => {
      return [selectedElementsList, setSelectedElementsList];
    };

    // Convenience selector for submitted-only list
    const getSubmittedFieldList = () => selectedElementsList.filter((el) => el.isSubmitted === true);

    // Read one
    const getSpecificField = (currElementId: string) => {
      const found = selectedElementsList.find((el) => el.inputId === currElementId);
      if (!found) {
        throw new Error(`Element not found for id: ${currElementId}`);
      }
      return found.InputComponent;
    };

    // Update component and mark submitted
    const setSubmittedFormComponent = (currElementId: string, formComponent: FormComponent) => {
      setSelectedElementsList((prev) =>
        prev.map((el) =>
          el.inputId === currElementId
            ? { ...el, InputComponent: formComponent, isSubmitted: true }
            : el
        )
      );
    };

    // Toggle submitted
    const setSubmittedStatus = (currElementId: string, submitStatus: boolean) => {
      setSelectedElementsList((prev) =>
        prev.map((el) => (el.inputId === currElementId ? { ...el, isSubmitted: submitStatus } : el))
      );
    };

    // Reorder by index (backward-compatible)
    const moveElement = (fromIndex: number, toIndex: number) => {
      setSelectedElementsList((prev) => {
        if (
          fromIndex === toIndex ||
          fromIndex < 0 ||
          toIndex < 0 ||
          fromIndex >= prev.length ||
          toIndex >= prev.length
        ) {
          return prev;
        }
        const next = prev.slice();
        const [moved] = next.splice(fromIndex, 1);
        next.splice(toIndex, 0, moved);
        return next;
      });
    };

    // Reorder by id to an absolute target index in the full list
    const moveById = (id: string, targetIndex: number) => {
      setSelectedElementsList((prev) => {
        const from = prev.findIndex((f) => f.inputId === id);
        if (from < 0 || targetIndex < 0 || targetIndex >= prev.length || from === targetIndex) return prev;
        const next = prev.slice();
        const [moved] = next.splice(from, 1);
        next.splice(targetIndex, 0, moved);
        return next;
      });
    };

    // Reorder by id relative to previous/next **submitted** neighbor (ideal for submitted-only UIs)
    const moveRelativeAmongSubmitted = (id: string, dir: "up" | "down") => {
      setSelectedElementsList((prev) => {
        const from = prev.findIndex((f) => f.inputId === id);
        if (from < 0) return prev;

        const step = dir === "up" ? -1 : 1;
        let to = from + step;

        // Skip over non-submitted items until we land on submitted
        while (to >= 0 && to < prev.length && !prev[to].isSubmitted) {
          to += step;
        }
        if (to < 0 || to >= prev.length) return prev;

        const next = prev.slice();
        const [moved] = next.splice(from, 1);
        next.splice(to, 0, moved);
        return next;
      });
    };

        return {
      // Reads
      getSelectedFieldList,
      getSubmittedFieldList,

      // Writes
      addElement,
      removeElement, // index-based (legacy)
      removeById, // id-based (preferred for filtered UIs)
      getSpecificField,
      setSubmittedFormComponent,
      setSubmittedStatus,

      // Moves
      moveElement, // index-based (legacy)
      moveById, // id-based
      moveRelativeAmongSubmitted, // id-based + submitted-neighbor aware
    };
  }

  export default FormComponentsArrayUtility ;